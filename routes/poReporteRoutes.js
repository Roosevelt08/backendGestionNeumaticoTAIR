const express = require('express');
const router = express.Router();
const poReporteController = require('../controllers/poReporteController');

/**
 * @swagger
 * /api/po-reportes/disponibles-por-mes:
 *   get:
 *     summary: Obtener cantidad de neumáticos disponibles por mes para un usuario
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: query
 *         name: usuario
 *         schema:
 *           type: string
 *         required: true
 *         description: Código del usuario
 *     responses:
 *       200:
 *         description: Lista de fechas y cantidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fecha:
 *                     type: string
 *                   cantidad:
 *                     type: integer
 */

// Endpoint para cantidad de neumáticos disponibles por mes
router.get('/disponibles-por-mes', poReporteController.getDisponiblesPorMes);

/**
 * @swagger
 * /api/po-reportes/asignados-por-mes:
 *   get:
 *     summary: Obtener cantidad de neumáticos asignados por mes para un usuario
 *     tags:
 *       - Reportes
 *     parameters:
 *       - in: query
 *         name: usuario
 *         schema:
 *           type: string
 *         required: true
 *         description: Código del usuario
 *     responses:
 *       200:
 *         description: Lista de fechas y cantidades
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   fecha:
 *                     type: string
 *                   cantidad:
 *                     type: integer
 */

// Endpoint para cantidad de neumáticos asignados por mes
router.get('/asignados-por-mes', poReporteController.getAsignadosPorMes);

module.exports = router;