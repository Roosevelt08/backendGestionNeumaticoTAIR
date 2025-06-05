const express = require("express");
const router = express.Router();
const { registrarReubicacionNeumatico } = require("../controllers/poMantenimientoController");

/**
 * @swagger
 * /api/registrorotacionneumatico:
 *   post:
 *     summary: Registra la reubicación (rotación) de uno o varios neumáticos en el vehículo
 *     tags:
 *       - Mantenimiento
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/ReubicacionNeumatico'
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/ReubicacionNeumatico'
 *     responses:
 *       201:
 *         description: Reubicación registrada correctamente
 *       500:
 *         description: Error al registrar la reubicación
 *
 * components:
 *   schemas:
 *     ReubicacionNeumatico:
 *       type: object
 *       properties:
 *         CODIGO: { type: string }
 *         MARCA: { type: string }
 *         MEDIDA: { type: string }
 *         DISEÑO: { type: string }
 *         REMANENTE: { type: integer }
 *         PR: { type: string }
 *         CARGA: { type: string }
 *         VELOCIDAD: { type: string }
 *         FECHA_FABRICACION: { type: string }
 *         RQ: { type: string }
 *         OC: { type: string }
 *         PROYECTO: { type: string }
 *         COSTO: { type: number }
 *         PROVEEDOR: { type: string }
 *         FECHA_REGISTRO: { type: string, format: date }
 *         FECHA_COMPRA: { type: string, format: date }
 *         USUARIO_SUPER: { type: string }
 *         PRESION_AIRE: { type: number }
 *         TORQUE_APLICADO: { type: number }
 *         ESTADO: { type: integer }
 *         PLACA: { type: string }
 *         POSICION_ORIGEN: { type: string, description: "Posición original del neumático" }
 *         POSICION_DESTINO: { type: string, description: "Nueva posición del neumático" }
 *         DESTINO: { type: string }
 *         FECHA_ASIGNACION: { type: string, format: date }
 *         KILOMETRO: { type: integer }
 *         FECHA_MOVIMIENTO: { type: string, format: date-time }
 *         OBSERVACION: { type: string }
 */

router.post("/registrorotacionneumatico", registrarReubicacionNeumatico);

module.exports = router;
