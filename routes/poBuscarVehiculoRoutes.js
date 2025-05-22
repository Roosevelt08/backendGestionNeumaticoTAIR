const express = require('express');
const router = express.Router();
const { buscarVehiculoPorPlaca } = require('../controllers/poBuscarVehiculoController');

/**
 * @swagger
 * /api/vehiculo/{placa}:
 *   get:
 *     summary: Buscar vehículo por placa
 *     tags: [Vehículos]
 *     parameters:
 *       - in: path
 *         name: placa
 *         required: true
 *         description: Placa del vehículo a buscar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Información del vehículo
 *         content:
 *           application/json:
 *             example:
 *               placa: "BLR-241"
 *               marca: "HYUNDAI"
 *               modelo: "TUCSON"
 *               tipo: "CAMIONETA NUEVA"
 *               color: "PLATA"
 *               año: 2019
 *       404:
 *         description: Vehículo no encontrado
 *       500:
 *         description: Error del servidor
 */
router.get('/:placa', buscarVehiculoPorPlaca);

module.exports = router;
