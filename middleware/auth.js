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

const authenticateAdminSignature = (req, res, next) => {
  const signature = req.body.signature;

  if (!signature) {
    console.log("sin firma");
    return res.status(401).json({ 'codigo': -1, 'mensaje': "Ah, Ah, Ah. No dijiste la palabra mágica", "imagen": "https://c.tenor.com/Vyg73kR334sAAAAC/tenor.gif"});
  }

  try {
    const decoded = jwt.verify(signature, process.env.ADMIN_SECRET);
    if(signature === req.session.signature) {
      console.log("Firma ya usada");
      return res.status(401).json({ 'codigo': -2, 'mensaje': "Firma ya usada"});
    } else {
      req.session.signature = signature
      req.user = decoded;
      console.log("autenticado correctamente");
      console.log(decoded);
      next();
    }
    
  } catch (err) {
    console.info("Autenticación fallida");
    console.error(err);
    req.session.signature = ""
    //res.status(400).json({ message: 'Token no valido' });
    return res.status(401).json({ 'codigo': -3, 'mensaje': "Firma no válida"});
  }
};

module.exports = {
  authenticateToken,
  authenticateAdminSignature,
};
