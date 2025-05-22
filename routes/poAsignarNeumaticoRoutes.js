const express = require("express");
const router = express.Router();
const { asignarNeumatico } = require("../controllers/poAsignarNeumaticoController");

/**
 * @swagger
 * /api/po-asignar-neumatico:
 *   post:
 *     summary: Asignar un neumático a un vehículo
 *     tags: [Asignar Neumático]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               placa:
 *                 type: string
 *               posicion:
 *                 type: string
 *               codigoNeumatico:
 *                 type: integer
 *               odometro:
 *                 type: integer
 *               observacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Neumático asignado correctamente
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.post("/", asignarNeumatico);

module.exports = router;
