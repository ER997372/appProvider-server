const AppInfoParser = require('app-info-parser');

function readApk(filepath) {
    return new Promise(async (resolve, reject) => {
        try {
            const parser = new AppInfoParser(filepath);
            parser.parse()
            .then(result => {
                console.log(JSON.stringify(result))

                resolve({versionName: result.versionName, versionCode: result.versionCode, packageName: result.package})
            })
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = {
    readApk,
}