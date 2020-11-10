module.exports = (req, res) => {
    res.status(200).json({ status: "ok", user: req.user });
};
