var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const ApplicationController = require('../controllers/ApplicationController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append extension
  }
});

const upload = multer({ storage });

/* GET home page. */
router.get('/', authenticateToken, ApplicationController.renderHome);

router.get('/dashboard', authenticateToken, ApplicationController.renderDashboard);

router.get('/create', authenticateToken, ApplicationController.renderCreateApplication);

// Route to handle the form submission for creating a new app
router.post('/create', authenticateToken, upload.single('file'), ApplicationController.createApplication);

router.get('/update', authenticateToken, ApplicationController.renderUpdateApplication);

router.post('/update', authenticateToken, upload.single('file'), ApplicationController.updateApplication);

router.post('/delete', authenticateToken, ApplicationController.deleteApplication);

module.exports = router;
