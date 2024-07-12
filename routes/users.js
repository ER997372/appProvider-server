var express = require('express');
var router = express.Router();
const sequelize = require('../persistance/database');
const User = require('../persistance/model/user')(sequelize, require('sequelize').DataTypes);

/* User login */
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  try {
    User.findOne({ where: { username } })
    .then((user) => {
      if (!user) {
        return res.render('index', { error: 'Usuario inexistente' });
      } else {
        user.validPassword(password)
        .then((isValid) => {
          if (isValid) {
            //req.session.userId = user.id;
            return res.redirect('/dashboard');
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
});

router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await User.create({ username, email, password });
    res.send('Usuario creado exitosamente');
  } catch (error) {
    res.status(500).send('Error al crear usuario: ' + error);
  }
});

module.exports = router;
