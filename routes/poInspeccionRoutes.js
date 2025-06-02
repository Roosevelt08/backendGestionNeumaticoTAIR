const express = require("express");
const router = express.Router();
const { crearInspeccion } = require("../controllers/poInspeccionController");

/**
 * @swagger
 * /api/inspeccion:
 *   post:
 *     summary: Crea una inspección y registra el movimiento
 *     tags:
 *       - Inspección
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               CODIGO:
 *                 type: string
 *               MARCA:
 *                 type: string
 *               MEDIDA:
 *                 type: string
 *               DISEÑO:
 *                 type: string
 *               REMANENTE:
 *                 type: integer
 *               PR:
 *                 type: string
 *               CARGA:
 *                 type: string
 *               VELOCIDAD:
 *                 type: string
 *               FECHA_FABRICACION:
 *                 type: string
 *                 format: date
 *               RQ:
 *                 type: string
 *               OC:
 *                 type: string
 *               PROYECTO:
 *                 type: string
 *               COSTO:
 *                 type: number
 *                 format: float
 *               OBSERVACION:
 *                 type: string
 *               PROVEEDOR:
 *                 type: string
 *               FECHA_REGISTRO:
 *                 type: string
 *                 format: date
 *               FECHA_COMPRA:
 *                 type: string
 *                 format: date
 *               USUARIO_SUPER:
 *                 type: string
 *               TIPO_MOVIMIENTO:
 *                 type: string
 *               PRESION_AIRE:
 *                 type: number
 *                 format: float
 *               TORQUE_APLICADO:
 *                 type: number
 *                 format: float
 *               ESTADO:
 *                 type: integer
 *               PLACA:
 *                 type: string
 *               POSICION_NEU:
 *                 type: string
 *               FECHA_ASIGNACION:
 *                 type: string
 *                 format: date
 *               KILOMETRO:
 *                 type: integer
 *               FECHA_MOVIMIENTO:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Inspección y movimiento registrados correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *       500:
 *         description: Error al registrar inspección y movimiento
 */
router.post("/", crearInspeccion);

module.exports = router;