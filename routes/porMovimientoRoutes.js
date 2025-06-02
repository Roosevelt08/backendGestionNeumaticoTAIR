const express = require("express");
const router = express.Router();
const { listarUltimosMovimientosPorPlaca } = require("../controllers/poMovimientoController");

/**
 * @swagger
 * /api/po-movimiento/ultimos/{placa}:
 *   get:
 *     summary: Obtiene el último movimiento de cada neumático instalado en una placa
 *     tags:
 *       - Movimientos
 *     parameters:
 *       - in: path
 *         name: placa
 *         required: true
 *         schema:
 *           type: string
 *         description: "Placa del vehiculo (ejemplo: BBD-715)"
 *     responses:
 *       200:
 *         description: Últimos movimientos de cada neumático en la placa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   ID_MOVIMIENTO:
 *                     type: integer
 *                   CODIGO:
 *                     type: string
 *                   MARCA:
 *                     type: string
 *                   MEDIDA:
 *                     type: string
 *                   DISEÑO:
 *                     type: string
 *                   REMANENTE:
 *                     type: integer
 *                   PR:
 *                     type: string
 *                   CARGA:
 *                     type: string
 *                   VELOCIDAD:
 *                     type: string
 *                   FECHA_FABRICACION:
 *                     type: string
 *                   RQ:
 *                     type: string
 *                   OC:
 *                     type: string
 *                   PROYECTO:
 *                     type: string
 *                   COSTO:
 *                     type: number
 *                   PROVEEDOR:
 *                     type: string
 *                   FECHA_REGISTRO:
 *                     type: string
 *                     format: date
 *                   FECHA_COMPRA:
 *                     type: string
 *                     format: date
 *                   USUARIO_SUPER:
 *                     type: string
 *                   TIPO_MOVIMIENTO:
 *                     type: string
 *                   PRESION_AIRE:
 *                     type: number
 *                   TORQUE_APLICADO:
 *                     type: number
 *                   ESTADO:
 *                     type: integer
 *                   PLACA:
 *                     type: string
 *                   POSICION_NEU:
 *                     type: string
 *                   FECHA_ASIGNACION:
 *                     type: string
 *                     format: date
 *                   KILOMETRO:
 *                     type: integer
 *                   FECHA_MOVIMIENTO:
 *                     type: string
 *                     format: date-time
 *       400:
 *         description: La placa es requerida
 *       500:
 *         description: Error al obtener últimos movimientos de neumáticos
 */

// GET /api/po-movimiento/ultimos/:placa
router.get("/ultimos/:placa", listarUltimosMovimientosPorPlaca);

module.exports = router;
