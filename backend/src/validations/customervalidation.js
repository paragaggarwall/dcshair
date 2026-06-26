const Joi = require("joi");


const consigneeSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    altPhone: Joi.string().trim().required().empty("").optional(),
    address: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    usciNo: Joi.string().trim().required(),
    pinCode: Joi.string().trim().length(6).pattern(/^[0-9]+$/).required(),
});

const notifyPartySchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    altPhone: Joi.string().trim().required().empty("").optional(),
    address: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    usciNo: Joi.string().trim().required(),
    pinCode: Joi.string().trim().length(6).pattern(/^[0-9]+$/).required(),
});

const contactPersonSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    altPhone: Joi.string().trim().required().empty("").optional(),
    address: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    usciNo: Joi.string().trim().required(),
    pinCode: Joi.string().trim().length(6).pattern(/^[0-9]+$/).required(),
});

const createCustomerSchema = Joi.object({
    // customer table fields
    name: Joi.string().trim().min(2).max(100).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().trim().required(),
    address: Joi.string().trim().required(),
    city: Joi.string().trim().required(),
    state: Joi.string().trim().required(),
    country: Joi.string().trim().required(),
    usciNo: Joi.string().trim().required(),
    pinCode: Joi.string().trim().length(6).pattern(/^[0-9]+$/).required(),
    // relations
    consignees: Joi.array().items(consigneeSchema).optional(),
    notifyParties: Joi.array().items(notifyPartySchema).optional(),
    contactPersons: Joi.array().items(contactPersonSchema).optional(),

}).unknown(true);

const updateCustomerSchema = Joi.object({
    name: Joi.string().trim().min(2).max(100).optional(),
    email: Joi.string().email().optional(),
    phone: Joi.string().trim().optional(),
    altPhone: Joi.string().trim().required().empty("").optional(),
    address: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    country: Joi.string().trim().optional(),
    usciNo: Joi.string().trim().optional(),
    pinCode: Joi.string().trim().length(6).pattern(/^[0-9]+$/).optional(),
    // relations
    consignees: Joi.array().items(consigneeSchema).required(),
    notifyParties: Joi.array().items(notifyPartySchema).required(),
    contactPersons: Joi.array().items(contactPersonSchema).required(),

}).min(1);




const addcustomerPartySchema = Joi.object({
    type: Joi.string().valid("consignee", "notifyParty", "contactPerson").required(),
    customerId: Joi.number().integer().required(),
    data: Joi.object({
        name: Joi.string().trim().min(2).max(100).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().trim().required(),
        altPhone: Joi.string().trim().required().empty("").optional(),
        address: Joi.string().trim().required(),
        city: Joi.string().trim().required(),
        state: Joi.string().trim().required(),
        country: Joi.string().trim().required(),
        usciNo: Joi.string().trim().required(),
        pinCode: Joi.string().trim().length(6).pattern(/^[0-9]+$/).required(),
    }).required(),
});
const deletecustomerPartySchema = Joi.object({
    type: Joi.string().valid("consignee", "notifyParty", "contactPerson").required(),
    customerId: Joi.number().integer().required(),
    partyid: Joi.number().integer().required(),
});


module.exports = { createCustomerSchema, updateCustomerSchema, addcustomerPartySchema, deletecustomerPartySchema, consigneeSchema, notifyPartySchema, contactPersonSchema };