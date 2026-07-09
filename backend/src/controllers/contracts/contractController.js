const prisma = require('../../db');
const { contractPdfGenerator } = require('./contractPdfGenerator');

// ─── helpers ───────────────────────────────────────────────────────────────
const PARTY_INCLUDE = {
  customer: true,
  consignee: true,
  notifyParty: true,
  contactPerson: true,
  termsOfPayment: true,
  contractItems: { include: { product: true } }
};

exports.createContract = async (req, res) => {
  try {
    const {
      contractname: name,
      customerId,
      consigneeId,
      notifyPartyId,
      contactPersonId,
      termsOfPaymentId,
      paymentterm,
      countryOfOrigin,
      countryOfDestination,
      portOfLoading,
      portOfFinalDestination,
      items,
      packing,
      insurance,
      description,
      otherref,
      shipingMark,
      preCarriageBy,
      operatingAirlines,
      flightNo,
      cartonweight,
      sizeScale,
      currency,
      expectedDepartureDate,
      expectedDeliveryDate,
    } = req.body;

    if (!items?.length) {
      throw new Error("At least one item is required");
    }

    const existcontract = await prisma.contract.findUnique({
      where: {
        name: name,
      }
    })

    if (existcontract) {
      throw new Error("please change the contract Name already exist");
    }

    const payload = {
      name,
      customerId: Number(customerId),
      consigneeId: consigneeId ? Number(consigneeId) : null,
      notifyPartyId: notifyPartyId ? Number(notifyPartyId) : null,
      contactPersonId: contactPersonId ? Number(contactPersonId) : null,
      termsOfPaymentId: Number(termsOfPaymentId),
      invoicepaymentterm: paymentterm,
      currency: currency,
      preCarriageBy,
      countryOfOrigin,
      countryOfDestination,
      portOfLoading,
      portOfFinalDestination,
      operatingAirlines,
      flightNo,
      expectedDepartureDate: expectedDepartureDate ? new Date(expectedDepartureDate) : null,
      expectedDepartureDateFormat: expectedDepartureDate,
      expectedDeliveryDate: expectedDeliveryDate ? new Date(expectedDeliveryDate) : null,
      expectedDeliveryDateFormat: expectedDeliveryDate,
      shipingMark,
      sizeScale,
      packing,
      otherRefrence: otherref,
      description,
      insurance,
      cartonweight: Number(cartonweight),
      createdBy: req.user.email,
      contractItems: {
        create: items.map((item) => ({
          productId: Number(item.productId),
          color: item.color,
          size: item.size,
          weight: Number(item.weight),
          pricePerKg: Number(item.pricePerKg),
          Amount: Number(item.weight) * Number(item.pricePerKg),
        })),
      },
    };

    let contract;

    try {
      contract = await prisma.contract.create({
        data: payload,
        include: PARTY_INCLUDE,
      });
    } catch (prismaError) {
      console.error("Prisma Create Contract Error:", prismaError);

      if (prismaError.code === "P2003") {
        throw new Error("Invalid customer, party, product or payment term reference");
      }

      if (prismaError.code === "P2025") {
        throw new Error("Related record not found");
      }

      throw new Error("Failed to create contract");
    }

    return res.status(201).json({
      success: true,
      message: "Contract created successfully",
      data: contract,
    });

  } catch (error) {
    console.error("Create Contract Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Something went wrong",
      data: null,
    });
  }
};

exports.getContracts = async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      include: PARTY_INCLUDE,
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!contracts || contracts.length === 0) {
      throw new Error("No contracts data found");
    }

    return res.status(200).json({
      success: true,
      message: "Fetch contracy data Successfully",
      data: contracts,
    });
  } catch (error) {
    console.error("Get Contracts Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch contracts",
    });
  }
};

// ─── getContractOptions ────────────────────────────────────────────────────
exports.getContractOptions = async (req, res) => {
  try {
    const [customers, products, termsOfPayment] = await Promise.all([
      prisma.customer.findMany({ select: { id: true, name: true, }, }),
      prisma.product.findMany({ select: { id: true, name: true, skuCode: true, }, }),
      prisma.termsOfPayment.findMany({ select: { id: true, name: true, }, }),
    ]);

    if (!customers || !products || !termsOfPayment) {
      throw new Error('Failed to fetch contract options');
    }

    return res.status(200).json({
      success: true,
      message: 'Contract options fetched successfully',
      data: { customers, products, termsOfPayment, },
    });
  } catch (error) {
    console.error('getContractOptions Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Contract options Api Error',
    });
  }
};

// ─── PDF generation ────────────────────────────────────────────────────────
exports.getContractPdf = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contract = await prisma.contract.findUnique({ where: { id }, include: PARTY_INCLUDE });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const pdfContract = { ...contract, items: contract.contractItems };
    const pdfBuffer = await contractPdfGenerator(pdfContract);
    const filename = `contract-${contract.name.replace(/[^a-zA-Z0-9-_]/g, '_')}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating contract PDF:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.previewContractPdf = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const contract = await prisma.contract.findUnique({ where: { id }, include: PARTY_INCLUDE });
    if (!contract) return res.status(404).json({ error: 'Contract not found' });

    const pdfContract = { ...contract, items: contract.contractItems };
    const pdfBuffer = await contractPdfGenerator(pdfContract);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline');
    res.setHeader('Content-Length', pdfBuffer.length);
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error previewing contract PDF:', error);
    res.status(500).json({ error: error.message });
  }
};

// ─── createTermsOfPayment ──────────────────────────────────────────────────
exports.createTermsOfPayment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      throw new Error("term of paymet name require");
    }

    const existingTerm = await prisma.termsOfPayment.findFirst({
      where: {
        name: name,
      },
    });

    if (existingTerm) {
      throw new Error("Terms of payment already exists");
    }

    const term = await prisma.termsOfPayment.create({
      data: {
        name: name,
        createdBy: req.user?.email,
      },
    });

    if (!term) {
      throw new Error("fail to create term of payment");
    }

    return res.status(201).json({
      success: true,
      message: "Terms of payment created successfully",
      data: term,
    });
  } catch (error) {
    console.error("Create Terms Of Payment Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "create payment term Error",
    });
  }
};

exports.getAllTermsOfPayment = async (req, res) => {
  try {
    const data = await prisma.termsOfPayment.findMany();

    if (!data) {
      throw new Error("data is not found termofPayment")
    }

    return res.status(200).json({
      success: true,
      message: "fetch allterm of payment Successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching terms of payment:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};