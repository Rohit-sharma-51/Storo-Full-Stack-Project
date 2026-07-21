const jwt = require('jsonwebtoken');

function authMiddleware(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) {
    return res.status(401).json({ error: "token is missing" });
  }

  const token = header.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: "Invalid Token" });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }

}

module.exports = authMiddleware;