const Joi = require("joi");
const { contractItemSchema } = require("./contractvalidation");

const proformaInvoiceSchema = Joi.object({
    contractId: Joi.number().integer().required(),
    proformaInvoiceNo: Joi.string().trim().required(),
    proformainvoiceDate: Joi.date().required(),
    customerId: Joi.number().integer().required(),
    consigneeId: Joi.number().integer().required(),
    notifyPartyId: Joi.number().integer().required(),
    contactPersonId: Joi.number().integer().required(),
    termsOfPaymentId: Joi.number().integer().required(),
    paymentterm: Joi.string().required(),
    lcnumber: Joi.string().required(),
    lcDate: Joi.date().required(),
    otherRef: Joi.string().allow("", null),
    countryOfOrigin: Joi.string().required(),
    countryOfFinalDestination: Joi.string().required(),
    portOfLoading: Joi.string().trim().required(),
    portOfFinalDestination: Joi.string().trim().required(),
    currency: Joi.string().valid("USD", "INR", "EUR").required(),
    operatingAirlines: Joi.string().trim().required(),
    flightNo: Joi.string().trim().required(),
    preCarriageBy: Joi.string().valid("Sea", "Air", "Road",).required(),
    totalAmount: Joi.number().min(1).required(),
    totalKgs: Joi.number().min(1).required(),
    description: Joi.string().allow("", null),
    packing: Joi.number().min(0).optional(),
    items: Joi.array().items(contractItemSchema).min(1).required(),
});


module.exports = { proformaInvoiceSchema }