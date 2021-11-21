const jwt = require('jsonwebtoken');

const autorisationMiddleware = async (req, res, next) => {
  try {
    const token = req.header('token');
    const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
    if (!verifyToken) res.status(401).json({ message: 'you are not authorized' });
    req.personId = verifyToken.id;
    next();
  } catch (error) {
    res.status(500).json({ message: error });
  }
};

module.exports = {autorisationMiddleware};