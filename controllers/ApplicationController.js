const Application = require('../persistance/model/application');
const User = require('../persistance/model/user');
const path = require('path');
const fs = require('fs');
const ApkReader = require('../utils/apkReader');


function renderHome(req, res, next) {
    res.redirect('/dashboard');
}

function renderDashboard(req, res, next) {
    if (!req.user) {
      return res.redirect('/');
    }
  
    Application.findAll({
        include: [{ model: User, as: 'user' }]
      }).then((applications) => {
        res.render('dashboard', { title: "TestFly Dashboard", applications });
      }).catch((error) => {
        console.error('Error fetching applications:', error);
        res.status(500).send('Error fetching applications');
      });
}

function renderCreateApplication(req, res, next) {
    res.render('newApp', { title: 'New App' });
}

function renderUpdateApplication(req, res, next) {
    Application.findOne({
      where: { id: req.query.id },
      include: [{ model: User, as: 'user' }]
    }).then((application) => {
      res.render("update", { title: "Update App", application})
    }).catch((error) => {
      console.log(error);
    res.redirect("/dashboard")
    });
}

function createApplication(req, res) {
    const { name } = req.body;

    ApkReader.readApk(req.file.path)
        .then((result) => {
          const packageName = result.packageName;
          const versionCode = result.versionCode;
          const versionName = result.versionName;
          Application.create({
            name,
            packageName,
            version: versionName,
            versionCode,
            userId: req.user.id,
            filePath: req.file.path // Save file path
          }).then((application) => {
            res.redirect('/applications/dashboard');
          }).catch((error) => {
            console.error('Error uploading app:', error);
            res.status(500).send('Error uploading app');
          });
        }).catch((error) => {
          console.error('Error uploading app:', error);
            res.status(500).send('Error uploading app');
        });
}

function updateApplication(req, res) {
    const { id } = req.body;
  
    // buscar el registro
    Application.findByPk(id).then((currentApplication) => {

      if(currentApplication) {
        ApkReader.readApk(req.file.path).then(result => {

          const packageName = result.packageName;
          const versionCode = result.versionCode;
          const versionName = result.versionName;

          // Eliminar el archivo viejo
          const oldFilePath = path.join(currentApplication.filePath);
          fs.unlink(oldFilePath, (err) => {
            if (err) {
              console.error('Error deleting old file:', err);
            }
          });
      
          // Actualizar los campos en el objeto consultado
          currentApplication.version = versionName
          currentApplication.versionCode = versionCode
          currentApplication.packageName = packageName
          currentApplication.filePath = req.file.path
      
          // Actualizar el registro en BD
          currentApplication.save();
      
          // Redirigir al dashboard
          res.redirect('/applications/dashboard');
        })
      } else {
        console.error('app not found');
        res.status(500).send('app not found');
      }
    }).catch((error) => {
      console.error('Error uploading app:', error);
    res.status(500).send('Error uploading app');
    });
}

function deleteApplication(req, res) {
    const { id } = req.body;
  
    // Borrar el archivo
    Application.findByPk(id).then((result) => {
      const filepath = path.join(result.filePath);
      fs.unlink(filepath, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        }
      });
  
      // Borrar el registro
      result.destroy().then(() => {
        res.redirect('/applications/dashboard');
      }).catch((error) => {
        console.error('Error deleting app:', error);
        res.status(500).send('Error deleting app');
      });
    }).catch((error) => {
      console.error('Error deleting app:', error);
    res.status(500).send('Error deleting app');
    });
}


async function getAllApplications(req, res, next) {
  if(req.headers.authorization === "Bearer wV6t>nQxo7p2gQ(?pRe<[l5HSW*/[pQa") {
    Application.findAll().then((apps) => {
      if(apps) {
        res.json({ code: 0, mensaje: "OK", apps});
      } else {
        res.json({ code: -1, mensaje: "sin aplicaciones"})
      }
    });
  } else {
    console.log("Error de autorizacion");
    res.status(403).json({ code: -1, mensaje: "No autorizado"})
  }
}

async function downloadApplication(req, res, next) {
  if(req.headers.authorization === "Bearer wV6t>nQxo7p2gQ(?pRe<[l5HSW*/[pQa") {
    const appId = req.params.appId;
    Application.findByPk(appId).then((app) => {
      if(app) {
        const filepath = path.join(app.filePath)
        if(fs.existsSync(filepath)) {
          res.download(filepath, app.filePath);
        } else {
          res.status(404).json({ code: -1, mensaje: "Archivo no encontrado"})
        }
      } else {
        res.status(500).json({ code: -1, mensaje: "Aplicacion inexistente"})
      }
    }).catch((error) => {
      console.log(error);
      res.status(500).json({ code: -1, mensaje: "sin aplicaciones"})
    });
  } else {
    console.log("Error de autorizacion");
    res.status(403).json({ code: -1, mensaje: "No autorizado"})
  }
}



module.exports = {
    renderHome,
    renderDashboard,
    renderCreateApplication,
    renderUpdateApplication,
    createApplication,
    updateApplication,
    deleteApplication,
    getAllApplications,
    downloadApplication
};