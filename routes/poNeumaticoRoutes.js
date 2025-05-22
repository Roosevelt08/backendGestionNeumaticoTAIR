const express = require('express');
const router = express.Router();
const poNeumaticoController = require('../controllers/poNeumaticoController');

/**
 * @swagger
 * tags:
 *   - name: Neumáticos
 *     description: Gestión de neumáticos
 */

/**
 * @swagger
 * /api/po-neumaticos:
 *   get:
 *     summary: Obtener todos los neumáticos
 *     tags:
 *       - Neumáticos
 *     responses:
 *       '200':
 *         description: Lista de neumáticos
 *         content:
 *           application/json:
 *             example:
 *               - CODIGO: 1000
 *                 MARCA: "PIRELLI"
 *                 MEDIDA: "245/75R16"
 *                 ESTADO: "DISPONIBLE"
 */
router.get('/', poNeumaticoController.getPoNeumaticos);


/**
 * @swagger
 * /api/po-neumaticos/{codigo}:
 *   put:
 *     summary: Actualizar un neumático por código
 *     tags:
 *       - Neumáticos
 *     parameters:
 *       - name: codigo
 *         in: path
 *         required: true
 *         description: Código del neumático a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marca:
 *                 type: string
 *                 description: Marca del neumático
 *               medida:
 *                 type: string
 *                 description: Medida del neumático
 *               estado:
 *                 type: string
 *                 description: Estado del neumático
 *     responses:
 *       '200':
 *         description: Neumático actualizado correctamente
 *       '400':
 *         description: Error de validación
 *       '500':
 *         description: Error del servidor
 */
router.put('/:codigo', poNeumaticoController.actualizarNeumatico);


/**
 * @swagger
 * /api/po-neumaticos/{codigo}:
 *   delete:
 *     summary: Eliminar un neumático por código
 *     tags: [Neumáticos]
 *     parameters:
 *       - in: path
 *         name: codigo
 *         schema:
 *           type: integer
 *         required: true
 *         description: Código del neumático a eliminar
 *     responses:
 *       '200':
 *         description: Neumático eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 mensaje:
 *                   type: string
 *                   example: Neumático eliminado correctamente
 *       '400':
 *         description: Código inválido
 *       '404':
 *         description: Neumático no encontrado
 *       '500':
 *         description: Error del servidor
 */
router.delete('/:codigo', poNeumaticoController.eliminarNeumatico);

/**
 * @swagger
 * /api/po-neumaticos/proyectos/cantidad:
 *   get:
 *     summary: Obtener la cantidad de proyectos 
 *     tags: [Neumáticos]
 *     responses:
 *       200:
 *         description: Cantidad de proyectos distintos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Error al contar proyectos
 */
router.get('/proyectos/cantidad', poNeumaticoController.contarProyectosNeumatico);

/**
 * @swagger
 * /api/po-neumaticos/cantidad:
 *   get:
 *     summary: Obtener la cantidad total de neumáticos
 *     tags: [Neumáticos]
 *     responses:
 *       200:
 *         description: Cantidad total de neumáticos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: integer
 *                   example: 100
 *       500:
 *         description: Error al contar neumáticos
 */
router.get('/cantidad', poNeumaticoController.contarNeumaticos);

/**
 * @swagger
 * /api/po-neumaticos/asignados/cantidad:
 *   get:
 *     summary: Obtener la cantidad de neumáticos asignados
 *     tags: [Neumáticos]
 *     responses:
 *       200:
 *         description: Cantidad de neumáticos asignados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Error al contar neumáticos asignados
 */
router.get('/asignados/cantidad', poNeumaticoController.contarNeumaticosAsignados);

/**
 * @swagger
 * /api/po-neumaticos/disponibles/cantidad:
 *   get:
 *     summary: Obtener la cantidad de neumáticos disponibles
 *     tags: [Neumáticos]
 *     responses:
 *       200:
 *         description: Cantidad de neumáticos disponibles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 cantidad:
 *                   type: integer
 *                   example: 15
 *       500:
 *         description: Error al contar neumáticos disponibles
 */
router.get('/disponibles/cantidad', poNeumaticoController.contarNeumaticosDisponibles);

module.exports = router; 