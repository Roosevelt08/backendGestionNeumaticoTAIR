const express = require("express");
const router = express.Router();
const { crearInspeccion } = require("../controllers/poInspeccionController");

/**
 * @swagger
 * /api/inspeccion:
 *   post:
 *     summary: Registra una o varias inspecciones de neumáticos y su movimiento asociado
 *     description: >-
 *       Permite registrar una inspección de neumático o un lote de inspecciones (enviar un objeto o un array de objetos). Cada inspección genera también un registro en NEU_MOVIMIENTO.
 *     tags:
 *       - Inspección
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             oneOf:
 *               - $ref: '#/components/schemas/InspeccionNeumatico'
 *               - type: array
 *                 items:
 *                   $ref: '#/components/schemas/InspeccionNeumatico'
 *           example:
 *             - CODIGO: "2114"
 *               MARCA: "PIRELLI"
 *               MEDIDA: "225/60R17"
 *               DISEÑO: "H/T"
 *               REMANENTE: 13
 *               PR: "6"
 *               CARGA: "1400"
 *               VELOCIDAD: "180"
 *               FECHA_FABRICACION: "3521-01-01"
 *               RQ: ""
 *               OC: "180"
 *               PROYECTO: "ILO"
 *               COSTO: 138.06
 *               OBSERVACION: "prueba inspeccion array"
 *               PROVEEDOR: "LLANTACENTRO GEPSA E I R L"
 *               FECHA_REGISTRO: "2025-06-09"
 *               FECHA_COMPRA: "2019-05-19"
 *               USUARIO_SUPER: "AHELFER"
 *               TIPO_MOVIMIENTO: "INSPECCION"
 *               PRESION_AIRE: 33
 *               TORQUE_APLICADO: 121
 *               ESTADO: 100
 *               PLACA: "AVR-701"
 *               POSICION_NEU: "POS01"
 *               FECHA_ASIGNACION: "2025-06-09"
 *               KILOMETRO: 275588
 *               FECHA_MOVIMIENTO: "2025-06-09T20:32:06.510Z"
 *     responses:
 *       201:
 *         description: Inspección(es) y movimiento(s) registrados correctamente
 *         content:
 *           application/json:
 *             example:
 *               mensaje: "Inspección(es) y movimiento(s) registrados correctamente"
 *               idsInspeccion: [1,2,3]
 *       400:
 *         description: Error de validación en los datos enviados
 *       500:
 *         description: Error interno al registrar inspección
 *
 * components:
 *   schemas:
 *     InspeccionNeumatico:
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
 *         OBSERVACION: { type: string }
 *         PROVEEDOR: { type: string }
 *         FECHA_REGISTRO: { type: string, format: date }
 *         FECHA_COMPRA: { type: string, format: date }
 *         USUARIO_SUPER: { type: string }
 *         TIPO_MOVIMIENTO: { type: string }
 *         PRESION_AIRE: { type: number }
 *         TORQUE_APLICADO: { type: number }
 *         ESTADO: { type: integer }
 *         PLACA: { type: string }
 *         POSICION_NEU: { type: string }
 *         FECHA_ASIGNACION: { type: string, format: date }
 *         KILOMETRO: { type: integer }
 *         FECHA_MOVIMIENTO: { type: string, format: date-time }
 */
router.post("/", crearInspeccion);

module.exports = router;