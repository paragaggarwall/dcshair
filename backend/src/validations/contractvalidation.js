const Joi = require("joi");

const contractItemSchema = Joi.object({
    productId: Joi.number().integer().required(),
    name: Joi.string().trim().required(),
    skuCode: Joi.string().allow("").required(),
    quantity: Joi.number().positive().required(),
    pricePerKg: Joi.number().positive().required(),
    color: Joi.string().allow("").optional(),
});

const createContractSchema = Joi.object({
    name: Joi.string().trim().required(),
    customerId: Joi.number().integer().required(),
    consigneeId: Joi.number().integer().allow(null, ""),
    notifyPartyId: Joi.number().integer().allow(null, ""),
    contactPersonId: Joi.number().integer().allow(null, ""),
    termsOfPaymentId: Joi.number().integer().required(),
    paymentterm: Joi.string().trim().required(),
    operatingAirlines: Joi.string().required(),
    preCarriageBy: Joi.string().allow("").required(),
    countryOfOrigin: Joi.string().trim().required(),
    countryOfDestination: Joi.string().trim().required(),
    portOfLoading: Joi.string().required(),
    portOfFinalDestination: Joi.string().required(),
    expectedDepartureDate: Joi.date().required(),
    expectedDeliveryDate: Joi.date().iso().required(),
    description: Joi.string().allow("").optional(),
    packing: Joi.string().allow("").optional(),
    insurance: Joi.string().allow("").optional(),
    speacialCondition: Joi.string().allow("").optional(),
    note: Joi.string().allow("").optional(),
    items: Joi.array().items(contractItemSchema).min(1).required(),
});

module.exports = { createContractSchema, contractItemSchema }