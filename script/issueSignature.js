require("dotenv").config();
const jwt = require('jsonwebtoken');

try {
    let firma = jwt.sign({ 'foo': process.env.ADMIN_PASSPHRASE }, process.env.ADMIN_SECRET, { expiresIn: Number(process.env.SIGNATURE_EXPIRATION) });
    console.log("Firma para registro de usuarios: " + firma);
    process.exit(0);
} catch (error) {
    console.info("Error al generar la firma");
    console.error(error);
    process.exit(-1);
}

