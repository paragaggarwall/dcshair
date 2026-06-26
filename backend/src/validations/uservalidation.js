const Joi = require("joi");

exports.createUserSchema = Joi.object({
    userName: Joi.string().trim().min(2).max(50).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).max(20).required(),
    role: Joi.string().valid("Admin", "User").required(),
});

exports.updateUserSchema = Joi.object({
    userName: Joi.string().trim().min(3).max(50),
    email: Joi.string().email(),
    password: Joi.string().min(6).max(20).empty("").optional(),
    role: Joi.string().valid("Admin", "User"),
}).min(1);


