const Joi = require("joi");

exports.createProductSchema = Joi.object({
    name: Joi.string().trim().min(2).max(50).required(),
    skuCode: Joi.string().trim().required(),
    imageUrl: Joi.string().allow("", null).optional(),
});