const User = require('../models/userSchema')

const isBanned = async (req, res, next) => {
    try {
        const findUser = await User.findById(req.personId);

        if (findUser.isBlocked) {
            res.status(400).json({ message: "Your account is banned !" });
        } else {
            next();
        }
    } catch (error) {
        res.status(400).json({ errors });
    }
};

module.exports = isBanned;