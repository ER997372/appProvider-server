var express = require('express');
var router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const sequelize = require('../persistance/database');
const Application = require('../persistance/model/application');
const User = require('../persistance/model/user');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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
router.get('/', authenticateToken, function(req, res, next) {
  res.redirect('/dashboard');
});


router.get('/dashboard', authenticateToken, async (req, res, next) => {
  if (!req.user) {
    return res.redirect('/');
  }

  try {
    const applications = await Application.findAll({
      include: [{ model: User, as: 'user' }]
    });
    res.render('dashboard', { title: "TestFly Dashboard", applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).send('Error fetching applications');
  }
});

router.get('/create', authenticateToken, function(req, res, next) {
  res.render('newApp', { title: 'TestFly New App' });
});


// Route to handle the form submission for creating a new app
router.post('/create', authenticateToken, upload.single('file'), async (req, res) => {
  const { name, packageName, version } = req.body;

  try {
    const application = await Application.create({
      name,
      packageName,
      version,
      userId: req.user.id,
      filePath: req.file.path // Save file path
    });

    res.redirect('/applications/dashboard');
  } catch (error) {
    console.error('Error uploading app:', error);
    res.status(500).send('Error uploading app');
  }
});

router.get('/update', authenticateToken, async function(req, res, next) {
  Application.findOne({
    where: { userId: req.query.id },
    include: [{ model: User, as: 'user' }]
  }).then((application) => {
    res.render("update", { title: "Update App", application})
  }).catch((error) => {
    console.log(error);
  res.redirect("/dashboard")
  });
});

router.post('/update', authenticateToken, upload.single('file'), async (req, res) => {
  const { id, version } = req.body;

  Application.findByPk(id).then((currentApplication) => {
    const oldFilePath = path.join(currentApplication.filePath);
    fs.unlink(oldFilePath, (err) => {
      if (err) {
        console.error('Error deleting old file:', err);
      }
    });

    currentApplication.version = version
    currentApplication.filePath = req.file.path

    currentApplication.save();

  
    res.redirect('/applications/dashboard');
  }).catch((error) => {
    console.error('Error uploading app:', error);
  res.status(500).send('Error uploading app');
  });
});

module.exports = router;
