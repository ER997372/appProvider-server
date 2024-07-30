const Application = require('../persistance/model/application');
const path = require('path');
const fs = require('fs');


function homePage(req, res, next) {
    res.redirect('/dashboard');
}


async function getAllApplications(req, res, next) {
    Application.findAll().then((apps) => {
      if(apps) {
        res.json({ code: 0, mensaje: "OK", apps});
      } else {
        res.json({ code: -1, mensaje: "sin aplicaciones"})
      }
    });
}

async function downloadApplication(req, res, next) {
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
  }



module.exports = {
    getAllApplications,
    downloadApplication
};