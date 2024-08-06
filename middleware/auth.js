const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    //return res.status(401).json({ message: 'Acceso denegado, no hay token' });
    console.log("sin token");
    return res.redirect('/');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log("autenticado correctamente");
    next();
  } catch (err) {
    console.log(err);
    //res.status(400).json({ message: 'Token no valido' });
    res.redirect('/');
  }
};

module.exports = {
  authenticateToken
};
