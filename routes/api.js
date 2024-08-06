var express = require('express');
var router = express.Router();
const ApplicationController = require('../controllers/ApplicationController');

// DEBUG eliminado autenticacion de token para pruebas
router.get('/applications/getAll', ApplicationController.getAllApplications);
  
// DEBUG eliminado autenticacion de token para pruebas
router.get('/download/:appId', ApplicationController.downloadApplication);

module.exports = router;
