const express = require("express");
const router = express.Router();
const poAsignadosController = require("../controllers/poAsignadosController");

/**
 * @swagger
 * tags:
 *   name: "Neumáticos Asignados"
 *   description: "Operaciones sobre asignaciones de neumáticos a vehículos"
 */

/**
 * @swagger
 * /api/po-asignados/{placa}:
 *   get:
 *     summary: Obtener neumáticos asignados por placa
 *     tags: [Neumáticos Asignados]
 *     parameters:
 *       - in: path
 *         name: placa
 *         required: true
 *         description: Placa del vehículo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de neumáticos asignados
 *         content:
 *           application/json:
 *             example:
 *               - ID: 1
 *                 PLACA: "BLR-241"
 *                 POSICION: "POS01"
 *                 CODIGO_NEU: 1001
 *                 MARCA: "PIRELLI"
 *                 MEDIDA: "245/75R16"
 *                 REMANENTE: 14
 *                 ESTADO: "ASIGNADO"
 *                 FECHA_ASIGNADO: "2025-05-09"
 *                 USUARIO_ASIGNA: "JZAVALETA"
 *       400:
 *         description: Error de validación
 *       500:
 *         description: Error del servidor
 */
router.get("/:placa", poAsignadosController.listarNeumaticosAsignados);

/**
 * @swagger
 * /api/po-asignados/{id}:
 *   delete:
 *     summary: Eliminar (desasignar) un neumático asignado por ID de asignación
 *     tags: [Neumáticos Asignados]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID de la asignación a eliminar
 *     responses:
 *       200:
 *         description: Asignación eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Asignación eliminada correctamente
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Asignación no encontrada
 *       500:
 *         description: Error del servidor
 */
router.delete('/:id', poAsignadosController.eliminarAsignacion);

module.exports = router;
