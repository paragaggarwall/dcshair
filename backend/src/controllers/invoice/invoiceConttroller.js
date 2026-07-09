const prisma = require("../../db");
const { generateInvoicePdf } = require("./invoicePdfGenerate");


const toPrismaDateTime = (dateTime) => {
  if (!dateTime) return null;

  const date = new Date(dateTime);

  // Return ISO string for Prisma
  return date.toISOString();
};

// exports.createshippingDetails = async (req, res) => {
//   try {
//     const data = req.body;

//     const {
//       invoiceId,
//       shippingBillNo,
//       shippingDate,
//       blOrAwbNo,
//       grossWeight,
//       narration,
//       cha,
//       shippingLineOrAirlineName,
//       ebrcReceivedDate,
//       ebrcNarration,
//       grReleaseDate,
//       grNarration,
//       epCopyDate,
//       epNarration,
//       exporterCopyDate,
//       exporterNarration,
//     } = data;

//     if (!invoiceId) {
//       return res.status(400).json({
//         success: false,
//         message: "Invoice ID is required",
//       });
//     }

//     const buildpayload = {
//       shippingBillNo: shippingBillNo,
//       shippingDate: shippingDate ? new Date(shippingDate) : null,
//       awbNo: blOrAwbNo,
//       grossWeight: grossWeight ? parseFloat(grossWeight) : null,
//       narration: narration,
//       // cha:cha,
//       // shippingLineOrAirlineName: shippingLineOrAirlineName,
//       // ebrcReceivedDate: ebrcReceivedDate,
//       // ebrcNarration: ebrcNarration,
//       // grReleaseDate: grReleaseDate,
//       // grNarration: grNarration,
//       // epCopyDate: epCopyDate,
//       // epNarration: epNarration,
//       // exporterCopyDate: exporterCopyDate,
//       // exporterNarration: exporterNarration,
//     };

//     const response = await prisma.invoice.update({
//       where: {
//         id: Number(invoiceId),
//       },
//       data: buildpayload,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Shipping details saved successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.error("Error saving shipping details:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to save shipping details",
//       error: error.message,
//     });
//   }
// };

// exports.createShippingTracking = async (req, res) => {
//   try {
//     const {
//       invoiceId,
//       trackingActivities = {},
//       customActivities = {},
//     } = req.body;

//     const payload = {
//       // Tracking Activities
//       stockOutFromPKSGodown: trackingActivities.stockOutFromPKS,
//       stockOutDateTime: toPrismaDateTime(trackingActivities.stockOutFromPKSDate),
//       factoryCode: trackingActivities.factoryCode,
//       lorryNo: trackingActivities.lorryNos,
//       shipmentTakenBy: trackingActivities.shipmentTakenBy,
//       shipmentHandedOverTo: trackingActivities.shipmentHandedOverTo,
//       lorryInCustomWarehouse: trackingActivities.lorryInCustomWarehouse,
//       lorryInCustomWarehouseDateTime: toPrismaDateTime(trackingActivities.lorryInCustomWarehouseDate),
//       lorryOutFromCustomWarehouse:
//         trackingActivities.lorryOutFromCustomWarehouse,
//       lorryOutFromCustomWarehouseDateTime:
//         toPrismaDateTime(trackingActivities.lorryOutFromCustomWarehouseDate),
//       driverName: trackingActivities.driversName,
//       driverPhone: trackingActivities.mobileNo,

//       // Custom Activities
//       passedShipmentFromCustom: customActivities.passedShipmentFromCustomOnDate,
//       passedShipmentFromCustomDate: toPrismaDateTime(customActivities.passedShipmentFromCustomOnDateVal),

//       containerNo: customActivities.containerNo,
//       containerStuffing: customActivities.containerStuffingDate,
//       containerStuffingDate:
//         toPrismaDateTime(customActivities.containerStuffingDateVal),

//       containerSealNo: customActivities.containerSealNo,
//       trainNo: customActivities.trainNo,
//       railOut: customActivities.railOutDate,
//       railOutDateTime: toPrismaDateTime(customActivities.railOutDateVal),
//     };

//     // Remove undefined fields
//     const updateData = Object.fromEntries(
//       Object.entries(payload).filter(([_, value]) => value !== undefined)
//     );

//     const response = await prisma.invoice.update({
//       where: {
//         id: invoiceId,
//       },
//       data: updateData,
//     });

//     return res.status(200).json({
//       success: true,
//       message: "Shipping tracking updated successfully",
//       data: response,
//     });
//   } catch (error) {
//     console.error("createShippingTracking error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update shipping tracking",
//       error: error.message,
//     });
//   }
// };

// exports.createCustomSaleDetails = async (req, res) => {
//   try {
//     const { invoiceId, amount, customExchangeRate, shippingBillNo, shippingBillDate, cifCfrValue, lessFreight, lessInsurance, lessCommission,
//       customFobValue, drawBackPercentage, drawBackValue, drawBackDateReceived, drawBackNarration, focusPercentage, focusValue,
//       focusDateReceived, } = req.body;

//     // Required validations
//     if (!invoiceId || !amount || !customExchangeRate || !shippingBillNo) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "invoiceId, amount, customExchangeRate and shippingBillNo are required",
//       });
//     }

//     // Check invoice already exists
//     const existingInvoice = await prisma.customSale.findUnique({
//       where: {
//         invoiceId: Number(invoiceId),
//       },
//     });

//     if (existingInvoice) {
//       return res.status(400).json({
//         success: false,
//         message: "Custom Sale already exists for this invoice",
//       });
//     }



//     const buildpayload = {
//       invoiceId: Number(invoiceId),
//       amount: Number(amount),
//       customExchangeRate: Number(customExchangeRate),
//       shippingBillNo: shippingBillNo.trim(),
//       shippingBillDate: shippingBillDate ? new Date(shippingBillDate) : null,
//       cifCfrValue: cifCfrValue ? Number(cifCfrValue) : null,
//       lessFreight: lessFreight ? Number(lessFreight) : null,
//       lessInsurance: lessInsurance ? Number(lessInsurance) : null,
//       lessCommission: lessCommission ? Number(lessCommission) : null,
//       customFobValue: customFobValue ? Number(customFobValue) : null,
//       drawBackPercentage: drawBackPercentage ? Number(drawBackPercentage) : null,
//       drawBackValue: drawBackValue ? Number(drawBackValue) : null,
//       drawBackDateReceived: drawBackDateReceived ? new Date(drawBackDateReceived) : null,
//       drawBackNarration: drawBackNarration?.trim() || null,
//       focusPercentage: focusPercentage ? Number(focusPercentage) : null,
//       focusValue: focusValue ? Number(focusValue) : null,
//       focusDateReceived: focusDateReceived ? new Date(focusDateReceived) : null,
//     };

//     const customSale = await prisma.customSale.create({
//       data: buildpayload,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Custom Sale created successfully",
//       data: customSale,
//     });
//   } catch (error) {
//     console.error("createCustomSaleDetails error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create Custom Sale",
//       error: error.message,
//     });
//   }
// };

// exports.createBankSaleDetails = async (req, res) => {
//   try {
//     const { invoiceId, amount, bankExchangeRate, bankRefNo, bankRefDate, negotiationAmount, lessFreight, lessInsurance, lessCommissionIfAny, bankFobValue,
//       dateOfRealisation, realisationNarration, realisationdueDate, courierCompany, trackingNo, } = req.body;

//     // Validate required fields
//     if (!invoiceId || !amount) {
//       return res.status(400).json({
//         success: false,
//         message: "invoiceId and amount are required",
//       });
//     }

//     // Check duplicate bankRefNo
//     if (bankRefNo?.trim()) {
//       const existingRef = await prisma.bankSale.findFirst({
//         where: {
//           bankRefNo: bankRefNo.trim(),
//         },
//       });

//       if (existingRef) {
//         return res.status(400).json({
//           success: false,
//           message: "Bank Reference Number already exists",
//         });
//       }
//     }

//     const buildpayload = {
//       invoiceId: Number(invoiceId),
//       amount: Number(amount),
//       bankExchangeRate: bankExchangeRate ? Number(bankExchangeRate) : null,
//       bankRefNo: bankRefNo?.trim() || null,
//       bankRefDate: bankRefDate ? new Date(bankRefDate) : null,
//       negotiationAmount: negotiationAmount ? Number(negotiationAmount) : null,
//       lessFreight: lessFreight ? Number(lessFreight) : null,
//       lessInsurance: lessInsurance ? Number(lessInsurance) : null,
//       lessCommissionIfAny: lessCommissionIfAny ? Number(lessCommissionIfAny) : null,
//       bankFobValue: bankFobValue ? Number(bankFobValue) : null,
//       dateOfRealisation: dateOfRealisation ? new Date(dateOfRealisation) : null,
//       realisationNarration: realisationNarration?.trim() || null,
//       realisationdueDate: realisationdueDate ? new Date(realisationdueDate) : null,
//       courierCompany: courierCompany?.trim() || null,
//       trackingNo: trackingNo?.trim() || null,
//     };

//     const bankSale = await prisma.bankSale.create({
//       data: buildpayload,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Bank Sale created successfully",
//       data: bankSale,
//     });
//   } catch (error) {
//     console.error("createBankSaleDetails error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to create Bank Sale",
//       error: error.message,
//     });
//   }
// };








exports.getAllInvoices = async (req, res) => {
  try {
    const data = await prisma.invoice.findMany({
      include: {
        customer: true,
      }
    });

    if (!data) {
      throw new Error("Invoice data not found");
    }

    return res.status(200).json({
      success: true,
      message: "Invoices fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching invoices:", error, error.message);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch invoices: ${error.message}`,
    });
  }
};

exports.getInvoicebyId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) { throw new Error("id is required"); }

    const data = await prisma.invoice.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        customer: true,
        proformaInvoice: {
          select: {
            id: true,
            proformaInvoiceNo: true,
          },
        },
        items: {
          include: {
            product: true,
          },
        },
        bankSales: true,
        customSale: true,
      },
    });

    if (!data) {
      throw new Error("Invoice data not found");
    }

    return res.status(200).json({
      success: true,
      message: "fetch Invoice Sucessfully",
      data,
    });
  } catch (error) {
    console.error("Error fetching invoice:", error.message);
    return res.status(500).json({
      success: false,
      message: `Failed to fetch invoice${error.message}`,
    });
  }
};

exports.createinvoice = async (req, res) => {
  try {
    const {
      invoiceNo,
      invoiceDate,
      proformaid,
      customerId,
      contractId,
      consigneeId,
      notifyPartyId,
      contactPersonId,
      consignee,
      notifyParty,
      contactPerson,
      termsOfPaymentId,
      preCarriageBy,
      invoicepaymentterm,
      operatingAirlines,
      flightNo,
      countryOfOrigin,
      countryOfFinalDestination,
      packing,
      cartonweight,
      shipingMark,
      description,
      sizeScale,
      portOfLoading,
      portOfFinalDestination,
      otherRef,
      currency,
      totalAmount,
      lcnumber,
      lcDate,
      items = [],
    } = req.body;

    if (!invoiceNo || !invoiceDate || !customerId || !termsOfPaymentId || !items.length) {
      throw new Error("invoiceNo, invoiceDate, customerId, termsOfPaymentId and items are required");
    }

    const existInvoice = await prisma.invoice.findUnique({
      where: {
        invoiceNo,
      },
    });

    if (existInvoice) {
      throw new Error(
        `Invoice number ${invoiceNo} already exists`
      );
    }

    const payload = {
      invoiceNo,
      invoiceDate: new Date(invoiceDate),
      invoiceDateFormat: invoiceDate,
      customerId: customerId,
      contractId: contractId,
      proformaInvoiceId: proformaid,
      consigneeId: consigneeId || consignee?.id,
      notifyPartyId: notifyPartyId || notifyParty?.id,
      contactPersonId: contactPersonId || contactPerson?.id,
      termsOfPaymentId: Number(termsOfPaymentId),
      invoicepaymentterm: invoicepaymentterm,
      preCarriageBy: preCarriageBy,
      currency: currency,
      operatingAirlines: operatingAirlines,
      flightNo,
      countryOfOrigin,
      countryOfDestination: countryOfFinalDestination,
      portOfLoading: portOfLoading,
      portOfFinalDestination: portOfFinalDestination,
      lcNumber: lcnumber,
      lcDate: new Date(lcDate),
      lcDateFormat: lcDate,
      cartonweight,
      shipingMark,
      sizeScale,
      packing,
      otherRefrence: otherRef,
      description,
      totalAmount: Number(totalAmount || 0),
      createdBy: req.user?.userName,
      items: {
        create: items.map((item) => ({
          productId: Number(item.productId),
          colour: item.color,
          size: item.size,
          weight: Number(item.weight),
          pricePerKg: Number(item.pricePerKg),
          Amount: Number(item.weight) * Number(item.pricePerKg),
        })),
      },
    };

    const invoice = await prisma.invoice.create({
      data: payload,
      include: {
        items: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });

  } catch (error) {
    console.error("Create invoice error:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


const removeUndefinedFields = (payload) => {
  if (!payload) return null;

  return Object.fromEntries(
    Object.entries(payload).filter(
      ([_, value]) => value !== undefined
    )
  );
};

exports.updateInvoiceDetails = async (req, res) => {
  try {
    const { userName, role } = req.user
    const invoiceId = Number(req.params.id);
    const { customSale, bankSale, items, ...invoiceData } = req.body;

    const existingInvoice = await prisma.invoice.findUnique({
      where: {
        id: Number(invoiceId),
      },
    });

    if (!existingInvoice) {
      return res.status(400).json({
        success: false,
        message: "this invoice not exist in db",
      });
    }

    const unique = await prisma.invoice.findFirst({
      where: {
        OR: [
          invoiceData.invoiceNo && { invoiceNo: invoiceData.invoiceNo },
          invoiceData.lrNo && { lrNo: invoiceData.lrNo },
          invoiceData.ewayBillNo && { ewayBillNo: invoiceData.ewayBillNo },
          invoiceData.shippingBillNo && { shippingBillNo: invoiceData.shippingBillNo },
        ].filter(Boolean),
      },
    });

    if (unique) {
      throw new Error("Duplicate entry found for invoiceNo / lrNo / ewayBillNo / shippingBillNo");
    }

    await prisma.$transaction(async (tx) => {
      // Update Invoice Fields
      if (Object.keys(invoiceData).length) {
        const invoicePayload = {
          consigneeId: invoiceData.consigneeId ? Number(invoiceData.consigneeId) : undefined,
          notifyPartyId: invoiceData.notifyPartyId ? Number(invoiceData.notifyPartyId) : undefined,
          contactPersonId: invoiceData.contactPersonId ? Number(invoiceData.contactPersonId) : undefined,
          termsOfPaymentId: invoiceData.termsOfPaymentId ? Number(invoiceData.termsOfPaymentId) : undefined,
          preCarriageBy: invoiceData.preCarriageBy,
          operatingAirlines: invoiceData.operatingAirlines,
          countryOfOrigin: invoiceData.countryOfOrigin,
          countryOfDestination: invoiceData.countryOfDestination,
          sizeScale: invoiceData.sizeScale,
          packing: invoiceData.packing,
          portOfLoading: invoiceData.portOfLoading,
          portOfFinalDestination: invoiceData.portOfFinalDestination,
          otherRefrence: invoiceData.otherRefrence,
          cartonWeight: invoiceData.cartonWeight ? Number(invoiceData.cartonWeight) : undefined,
          currency: invoiceData.currency,
          totalAmount: invoiceData.totalAmount ? Number(invoiceData.totalAmount) : undefined,
          shippingBillNo: invoiceData.shippingBillNo,
          shippingDate: invoiceData.shippingDate ? new Date(invoiceData.shippingDate) : undefined,
          awbNo: invoiceData.awbNo,
          grossWeight: invoiceData.grossWeight ? Number(invoiceData.grossWeight) : undefined,
          narration: invoiceData.narration,
          stockOutFromPKSGodown: invoiceData.stockOutFromPKSGodown,
          stockOutDateTime: invoiceData.stockOutDateTime ? new Date(invoiceData.stockOutDateTime) : undefined,
          factoryCode: invoiceData.factoryCode,
          lorryNo: invoiceData.lorryNo,
          shipmentTakenBy: invoiceData.shipmentTakenBy,
          shipmentHandedOverTo: invoiceData.shipmentHandedOverTo,
          lorryInCustomWarehouse: invoiceData.lorryInCustomWarehouse,
          lorryInCustomWarehouseDateTime: invoiceData.lorryInCustomWarehouseDateTime ? new Date(invoiceData.lorryInCustomWarehouseDateTime) : undefined,
          lorryOutFromCustomWarehouse: invoiceData.lorryOutFromCustomWarehouse,
          lorryOutFromCustomWarehouseDateTime: invoiceData.lorryOutFromCustomWarehouseDateTime ? new Date(invoiceData.lorryOutFromCustomWarehouseDateTime) : undefined,
          passedShipmentFromCustom: invoiceData.passedShipmentFromCustom,
          passedShipmentFromCustomDate: invoiceData.passedShipmentFromCustomDate ? new Date(invoiceData.passedShipmentFromCustomDate) : undefined,
          containerNo: invoiceData.containerNo,
          containerStuffing: invoiceData.containerStuffing,
          containerStuffingDate: invoiceData.containerStuffingDate ? new Date(invoiceData.containerStuffingDate) : undefined,
          containerSealNo: invoiceData.containerSealNo,
          flightNo: invoiceData.flightNo,
          trainNo: invoiceData.trainNo,
          railOut: invoiceData.railOut,
          railOutDateTime: invoiceData.railOutDateTime ? new Date(invoiceData.railOutDateTime) : undefined,
          dispatchDate: invoiceData.dispatchDate ? new Date(invoiceData.dispatchDate) : undefined,
          transporterName: invoiceData.transporterName,
          vehicleNo: invoiceData.vehicleNo,
          driverName: invoiceData.driverName,
          driverPhone: invoiceData.driverPhone,
          ewayBillNo: invoiceData.ewayBillNo,
          lrNo: invoiceData.lrNo,
          delivered: invoiceData.delivered,
          deliveredDate: invoiceData.deliveredDate ? new Date(invoiceData.deliveredDate) : undefined,
          deliveryNarration: invoiceData.deliveryNarration,

        };
        const cleanedInvoicePayload = removeUndefinedFields(invoicePayload)

        await tx.invoice.update({
          where: { id: invoiceId },
          data: cleanedInvoicePayload,
        });
      }

      // Update Custom Sale
      if (customSale && Object.keys(customSale).length) {
        const customSalePayload = {
          customExchangeRate: customSale.customExchangeRate ? Number(customSale.customExchangeRate) : undefined,
          shippingBillNo: customSale.shippingBillNo || undefined,
          shippingBillDate: customSale.shippingBillDate ? new Date(customSale.shippingBillDate) : undefined,
          cifCfrValue: customSale.cifCfrValue ? Number(customSale.cifCfrValue) : undefined,
          lessFreight: customSale.lessFreight ? Number(customSale.lessFreight) : undefined,
          lessInsurance: customSale.lessInsurance ? Number(customSale.lessInsurance) : undefined,
          lessCommission: customSale.lessCommission ? Number(customSale.lessCommission) : undefined,
          customFobValue: customSale.customFobValue ? Number(customSale.customFobValue) : undefined,
          drawBackPercentage: customSale.drawBackPercentage ? Number(customSale.drawBackPercentage) : undefined,
          drawBackValue: customSale.drawBackValue ? Number(customSale.drawBackValue) : undefined,
          drawBackDateReceived: customSale.drawBackDateReceived ? new Date(customSale.drawBackDateReceived) : undefined,
          drawBackNarration: customSale.drawBackNarration || undefined,
          focusPercentage: customSale.focusPercentage ? Number(customSale.focusPercentage) : undefined,
          focusValue: customSale.focusValue ? Number(customSale.focusValue) : undefined,
          focusDateReceived: customSale.focusDateReceived ? new Date(customSale.focusDateReceived) : undefined,
        };
        const cleanedCustomSalePayload = removeUndefinedFields(customSalePayload);

        const existingCustomSale = await tx.customSale.findUnique({
          where: { invoiceId },
        });

        if (existingCustomSale) {
          await tx.customSale.update({
            where: { id: existingCustomSale.id },
            data: cleanedCustomSalePayload,
          });
        } else {
          await tx.customSale.create({
            data: {
              invoiceId: invoiceId,
              createdBy: userName,
              ...cleanedCustomSalePayload,
            },
          });
        }
      }

      // Update Bank Sale
      if (bankSale && Object.keys(bankSale).length) {

        const bankSalePayload = {
          bankExchangeRate: bankSale.bankExchangeRate ? Number(bankSale.bankExchangeRate) : undefined,
          bankRefNo: bankSale.bankRefNo || undefined,
          bankRefDate: bankSale.bankRefDate ? new Date(bankSale.bankRefDate) : undefined,
          negotiationAmount: bankSale.negotiationAmount ? Number(bankSale.negotiationAmount) : undefined,
          lessFreight: bankSale.lessFreight ? Number(bankSale.lessFreight) : undefined,
          lessInsurance: bankSale.lessInsurance ? Number(bankSale.lessInsurance) : undefined,
          lessCommissionIfAny: bankSale.lessCommissionIfAny ? Number(bankSale.lessCommissionIfAny) : undefined,
          bankFobValue: bankSale.bankFobValue ? Number(bankSale.bankFobValue) : undefined,
          dateOfRealisation: bankSale.dateOfRealisation ? new Date(bankSale.dateOfRealisation) : undefined,
          realisationNarration: bankSale.realisationNarration || undefined,
          realisationdueDate: bankSale.realisationdueDate ? new Date(bankSale.realisationdueDate) : undefined,
          courierCompany: bankSale.courierCompany || undefined,
          trackingNo: bankSale.trackingNo || undefined,
        };

        const cleanedbankSalePayload = removeUndefinedFields(bankSalePayload)

        const existingBankSale = await tx.bankSale.findUnique({
          where: { invoiceId },
        });

        if (existingBankSale) {
          await tx.bankSale.update({
            where: { id: existingBankSale.id },
            data: cleanedbankSalePayload,
          });
        } else {
          await tx.bankSale.create({
            data: {
              invoiceId: invoiceId,
              createdBy: userName,
              ...cleanedbankSalePayload,
            },
          });
        }
      }

      // Update Items
      if (Array.isArray(items)) {
        for (const item of items) {
          const { id, ...itemData } = item;

          if (!id) continue;

          await tx.invoiceItem.update({
            where: { id },
            data: itemData,
          });
        }
      }
    });

    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("invoice err update", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getInvoicePdf = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error('invoice_id is invalid')
    }

    const Invoice = await prisma.invoice.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!Invoice) {
      throw new Error('invoice data not found')
    }

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="invoice-${Invoice.InvoiceNo}.pdf"`
    );

    await generateInvoicePdf(Invoice, res);

  } catch (error) {
    console.error("Error generating proforma invoice PDF:", error.message, error,);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to generate proforma invoice PDF",
      });
    }
    res.end();
  }
}