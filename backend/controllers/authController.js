const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (email !== process.env.ADMIN_EMAIL) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    if (password !== process.env.ADMIN_PASSWORD) {
        return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
        { role: "admin", email },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token });
};
