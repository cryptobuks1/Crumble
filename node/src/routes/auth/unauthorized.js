module.exports = (req, res) => {
    res.status(401).json({ status: "unauthorized", message: "missing or invalid token" });
};
