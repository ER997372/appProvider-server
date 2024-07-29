const jwt = require('jsonwebtoken');

const generateToken = (user) => {
  // Payload can be customized based on your needs
  const payload = {
    id: user.id,
    username: user.username,
    email: user.email
  };

  // Sign the token with a secret key and set expiration time (e.g., 1 hour)
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: Number(process.env.JWT_EXPIRATION) });
};

module.exports = {
  generateToken
};
