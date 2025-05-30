const express = require("express");
const router = express.Router();
const { asignarNeumatico } = require("../controllers/poAsignarNeumaticoController");

/**
 * @swagger
 * /api/po-asignar-neumatico:
 *   post:
 *     summary: Asignar un neumático a un vehículo
 *     description: >
 *       Requiere sesión autenticada. El usuario que realiza la asignación se toma automáticamente de la sesión y no debe enviarse en el body.
 *     tags: [Asignar Neumático]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - CodigoNeumatico
 *               - Remanente
 *               - PresionAire
 *               - TorqueAplicado
 *               - Placa
 *               - Posicion
 *               - Odometro
 *             properties:
 *               CodigoNeumatico:
 *                 type: integer
 *                 description: Código del neumático
 *                 example: 12345
 *               Remanente:
 *                 type: number
 *                 description: Remanente del neumático
 *                 example: 10.5
 *               PresionAire:
 *                 type: number
 *                 description: Presión de aire
 *                 example: 32
 *               TorqueAplicado:
 *                 type: number
 *                 description: Torque aplicado
 *                 example: 120
 *               Placa:
 *                 type: string
 *                 description: Placa del vehículo
 *                 example: "ABC123"
 *               Posicion:
 *                 type: string
 *                 description: Posición del neumático
 *                 example: "DELANTERA_IZQUIERDA"
 *               Odometro:
 *                 type: integer
 *                 description: Kilometraje del vehículo
 *                 example: 50000
 *     responses:
 *       200:
 *         description: Neumático asignado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autenticado
 *       409:
 *         description: El neumático ya está asignado a otro vehículo o posición
 *       500:
 *         description: Error del servidor
 */
router.post("/", asignarNeumatico);

module.exports = router;
