// middlewares/upload.js
const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // Carpeta donde se guardará el archivo
    },
    filename: function (req, file, cb) {
        // Nombre del archivo: padron_+timestamp+extensión
        cb(null, 'padron_' + Date.now() + path.extname(file.originalname));
    }
});

// Exportar middleware listo para usar en rutas
const upload = multer({ storage });

module.exports = upload;
