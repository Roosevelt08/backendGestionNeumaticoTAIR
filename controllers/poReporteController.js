const db = require('../config/db');// Ajusta según tu conexión a la base de datos

// Obtener cantidad de neumáticos disponibles por mes para un usuario
exports.getDisponiblesPorMes = async (req, res) => {
    try {
        const usuario = String(req.query.usuario).trim(); // El usuario se pasa como query param y se limpia
        // Llamada al stored procedure
        const result = await db.query('CALL SPEED400AT.SP_DISPONIBLES_POR_MES(?)', [usuario]);
        // console.log('Usuario recibido:', usuario);
        // console.log('Llamada al SP: CALL SPEED400AT.SP_DISPONIBLES_POR_MES(?)', usuario);
        // console.log('Resultado SP:', result);
        // Filtrar solo los objetos que contienen datos reales (FECHA y CANTIDAD)
        const data = Array.isArray(result)
            ? result.filter(r => r && r.FECHA && r.CANTIDAD !== undefined)
            : [];
        res.json(data);
    } catch (error) {
        console.error('Error al obtener neumáticos disponibles por mes:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};

// Obtener cantidad de neumáticos asignados por mes para un usuario
exports.getAsignadosPorMes = async (req, res) => {
    try {
        const usuario = String(req.query.usuario).trim();
        const result = await db.query('CALL SPEED400AT.SP_ASIGNADOS_POR_MES(?)', [usuario]);
        const data = Array.isArray(result)
            ? result.filter(r => r && r.FECHA && r.CANTIDAD !== undefined)
            : [];
        res.json(data);
    } catch (error) {
        console.error('Error al obtener neumáticos asignados por mes:', error);
        res.status(500).json({ error: 'Error al obtener datos' });
    }
};