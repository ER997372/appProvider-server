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

const fileFilter = (req, file, cb) => {
  const fileExtension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = ['.apk'];
  
  if (file.mimetype === 'application/vnd.android.package-archive' || 
      (file.mimetype === 'application/octet-stream' && allowedExtensions.includes(fileExtension))) {
    cb(null, true);
  } else {
    cb(new Error('Only APK files are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });

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
