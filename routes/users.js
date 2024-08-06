var express = require('express');
var router = express.Router();
const UsersController = require('../controllers/UsersController');

/* User login */
router.post('/login', UsersController.authUser);

router.get('/logout', UsersController.deauthUser);

router.post('/register', UsersController.registerUser);

module.exports = router;
