const { errored } = require('pdfkit/js/pdfkit.standalone');
const prisma = require('../../db');








exports.getCustomers = async (req, res) => {
  try {
    const customers = await prisma.customer.findMany({
      orderBy: {
        id: "desc",
      },
    });
    if (!customers) { throw new Error("customers not found"); }
    return res.status(200).json({
      success: true,
      message: "customer fetch Succesfully",
      data: customers,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong getCustomer",
    });
  }
};

exports.getCustomerbyId = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    if (!id) { throw new Error("id is required"); }

    const customer = await prisma.customer.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        consignees: true,
        notifyParties: true,
        contactPersons: true
      }
    });

    if (!customer) {
      throw new Error("Customer not found");
    }

    return res.status(200).json({
      success: true,
      message: "customer Fetch Successfully",
      data: customer,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong customer fetch",
    });
  }
};

exports.createCustomer = async (req, res) => {
  try {
    const { consignees, notifyParties, contactPersons, ...customerData } = req.body;
    console.log(req.body);
    console.log("customerData", customerData);
    const customerEmailExists = await prisma.customer.findFirst({
      where: {
        email: customerData.email
      }
    });
    if (customerEmailExists) {
      throw new Error('Customer email already exists');
    }

    const createData = {
      ...customerData,
      createdBy: req.user.email
    };

    if (consignees && consignees.length > 0) {
      createData.consignees = { create: consignees };
    }

    if (notifyParties && notifyParties.length > 0) {
      createData.notifyParties = { create: notifyParties };
    }
    if (contactPersons && contactPersons.length > 0) {
      createData.contactPersons = { create: contactPersons };
    }

    console.log("createData", createData);


    const customer = await prisma.customer.create({
      data: createData,
      include: {
        consignees: true,
        notifyParties: true,
        contactPersons: true
      }
    });

    return res.status(200).json({
      success: true,
      message: "Succesfully customer created",
      data: customer
    })

  } catch (error) {
    console.log("efergrt", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    })

  }
};

exports.updateCustomerbyId = async (req, res) => {
  try {

    const { id } = req.params;
    if (!id) { throw new Error('id is required') }
    const { consignees = [], notifyParties = [], contactPersons = [] } = req.body;


    const exist = await prisma.customer.findUnique({
      where: {
        id: Number(id)
      }
    });

    if (!exist) {
      const error = new Error("Customer not exist");
      error.statusCode = 404;
      throw error;
    }

    const customer = await prisma.customer.update({
      where: {
        id: Number(id)
      },
      data: {
        consignees: {
          deleteMany: {},
          create: consignees
        },
        notifyParties: {
          deleteMany: {},
          create: notifyParties
        },
        contactPersons: {
          deleteMany: {},
          create: contactPersons
        }

      },


      include: {

        consignees: true,

        notifyParties: true,

        contactPersons: true

      }

    });

    return res.status(200).json({
      success: true,
      message: "Customer updated successfully",
      data: customer
    });
  } catch (error) {
    console.error("Update customer failed:", error.message);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Update customer failed:"
    });

  }
};


// ─── createParty ───────────────────────────────────────────────────────────
// Generic create for any sub-entity type belonging to a customer
exports.createParty = async (req, res) => {
  try {
    const { type, customerId, data } = req.body;

    const models = {
      consignee: prisma.consignee, notifyParty: prisma.notifyParty, contactPerson: prisma.contactPerson,
    };

    if (!models[type]) {
      throw new Error("Invalid party type");
    }

    if (!customerId) {
      throw new Error("Customer ID is required");
    }

    if (!data?.email) {
      throw new Error("Email is required");
    }

    const emailAlreadyExist = await models[type].findFirst({
      where: {
        customerId: Number(customerId),
        email: data.email,
      },
    });

    if (emailAlreadyExist) {
      throw new Error("Email already exists");
    }

    const record = await models[type].create({
      data: {
        ...data,
        customerId: Number(customerId),
        createdBy: req.user.email,
      },
    });

    return res.status(201).json({
      success: true,
      message: `${type} created successfully`,
      data: record,
    });
  } catch (error) {
    console.error("Create Party Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong create party",
      data: null,
    });
  }
};
exports.deleteParty = async (req, res) => {
  try {
    const { type, customerId, partyid } = req.body;

    const models = {
      consignee: prisma.consignee, notifyParty: prisma.notifyParty, contactPerson: prisma.contactPerson,
    };
    if (!models[type]) {
      throw new Error("Invalid party type");
    }
    if (!customerId) {
      throw new Error("Customer ID is required");
    }
    if (!partyid) {
      throw new Error("Party ID is required");
    }

    const existingParty = await models[type].findFirst({
      where: {
        id: Number(partyid),
        customerId: Number(customerId),
      },
    });

    if (!existingParty) {
      throw new Error("Party not found");
    }

    const record = await models[type].delete({
      where: {
        id: Number(partyid),
      },
    });

    return res.status(200).json({
      success: true,
      message: `${type} deleted successfully`,
      data: record,
    });
  } catch (error) {
    console.error("Delete Party Error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Something went wrong delete customer party",
    });
  }
};