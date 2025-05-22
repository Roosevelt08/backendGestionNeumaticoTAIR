const express = require('express');
const router = express.Router();

const upload = require('../middlewares/upload'); // Importar el middleware
const { cargarPadronDesdeExcel } = require('../controllers/poPadronController');


/**
 * @swagger
 * /api/po-padron/cargar-padron:
 *   post:
 *     summary: Cargar padrón desde un archivo Excel
 *     tags: [Padrón]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               archivo:
 *                 type: string
 *                 format: binary
 *                 description: Archivo Excel a cargar
 *     responses:
 *       200:
 *         description: Padrón cargado correctamente
 *       400:
 *         description: Error en la solicitud
 *       500:
 *         description: Error al cargar el padrón
 */
router.post('/cargar-padron', upload.single('archivo'), cargarPadronDesdeExcel);

module.exports = router;

