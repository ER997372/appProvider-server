const User = require('../persistance/model/user');
const { generateToken } = require('../utils/jwt');
const bcrypt = require("bcrypt");

function registerUser(req, res) {
    const { username, email, password } = req.body;

    User.create({ username, email, password })
    .then((user) => {
      res.send('Usuario creado exitosamente');
    })
    .catch((error) => {
        res.status(500).send('Error al crear usuario: ' + error);
    });
}

function authUser(req, res, next) {
    const { username, password } = req.body;
    try {
      User.findOne({ where: { username } })
      .then((user) => {
        if (!user) {
          return res.render('index', { error: 'Usuario inexistente' });
        } else {
          bcrypt.compare(password, user.password)
          .then((isValid) => {
            if (isValid) {
              //req.session.userId = user.id;
              const token = generateToken(user);
              // Set the token as a cookie
              res.cookie('token', token, { httpOnly: true, secure: true });
              return res.redirect('/applications/dashboard');
            } else {
              return res.render('index', { error: 'Contraseña no válida' });
            }
          })
          .catch((err) => {
            console.log(err);
            return res.render('index', { error: 'Contraseña no válida' });
          });
        }
      }).catch((err) => {
        console.log(err);
        return res.render('index', { error: 'Error al consultar la base de datos' });
      });
      
    } catch (error) {
      console.error('Error logging in user:', error);
      return res.render('index', { error: 'Ocurrió un error' });
    }
}

function deauthUser(req, res) {
    res.clearCookie('token');
    res.redirect('/');
}



module.exports = {
    registerUser,
    authUser,
    deauthUser,
}