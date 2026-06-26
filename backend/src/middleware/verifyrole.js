const verifyRoles = (allowedRoles) => (req, res, next) => {
    try {
        const {role} = req.user;
        // Check if the user has at least one of the required roles.
        const hasRequiredRole = allowedRoles.some(roles => role.includes(roles));

        // console.log("erfer",req.user);
        // console.log("rverf",allowedRoles);
        if (hasRequiredRole) {
            // console.log("has the role");
            next(); // User has the required role, proceed to the next middleware/route handler.
        } else {
            // User does not have the required role, throw an error.
            return res.status(403).json({ message: 'You do not have access to this route' })
        }
    } catch (error) {
        return res.status(500).json({ message: `error while verifying role. ${error.message}` })
    }
};

module.exports = { verifyRoles } 