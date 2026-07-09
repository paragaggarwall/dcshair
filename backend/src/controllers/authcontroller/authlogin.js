const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../../db');

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, userName: user.userName },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        const { password: _, ...userWithoutPassword } = user;
        res.json({ token, user: userWithoutPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    const cookies = req.cookies;
    const isProduction = process.env.NODE_ENV === "production";

    if (!cookies?.jwt) return res.sendStatus(204); //No content
    res.clearCookie("jwt", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
    });
    res.json({ message: "you are logout" });
};

