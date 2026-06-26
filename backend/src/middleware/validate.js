module.exports = (schema) => {

    return (req, res, next) => {

        if (!schema) {
            return res.status(500).json({
                success: false,
                message: "Validation schema missing"
            });
        }

        const { error, value } = schema.validate(req.body, {
            abortEarly: false,
            // stripUnknown: true
        });


        if (error) {
            return res.status(400).json({
                success: false,
                message: error.details.map(err => err.message)
            });
        }

        // req.body = value;

        next();
    };
};