var express = require('express');
var router = express.Router();
const UsersController = require('../controllers/UsersController');
const { authenticateAdminSignature } = require('../middleware/auth');


/* User login */
router.post('/login', UsersController.authUser);

router.get('/logout', UsersController.deauthUser);

router.post('/register', authenticateAdminSignature, UsersController.registerUser);

module.exports = router;
