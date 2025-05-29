const db = require("../config/db");

const listarNeumaticosAsignados = async (req, res) => {
    try {
        const { placa } = req.params;

        if (!placa || placa.trim() === "") {
            return res.status(400).json({ error: "La placa es requerida" });
        }

        const query = `CALL SPEED400AT.SP_LISTAR_NEU_ASIGNADO(?)`;
        console.log(`🟡 Ejecutando query: ${query} con placa: ${placa}`);

        const result = await db.query(query, [placa]);
        console.log("🔵 Resultado crudo del SP:", JSON.stringify(result, null, 2));

        // Manejo seguro del resultado del SP
        // MySQL suele devolver [ [rows], ... ]
        const rows = Array.isArray(result) && Array.isArray(result[0]) ? result[0] : [];
        res.json(rows);
    } catch (error) {
        console.error("❌ Error al consultar SP_LISTAR_NEU_ASIGNADO:", error);
        res.status(500).json({ error: "Error al obtener neumáticos asignados" });
    }
};
 
const eliminarAsignacion = async (req, res) => {
    const { id } = req.params;

    // Validar que el ID venga y sea un número
    if (!id || isNaN(Number(id))) {
        return res.status(400).json({ error: 'ID inválido' });
    }

    try {
        // Ejecutamos el DELETE
        const result = await db.query(
            'DELETE FROM SPEED400AT.NEU_ASIGNADO WHERE ID_ASIGNADO = ?',
            [id]
        );

        // Si no se afectó ninguna fila, el registro no existía
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Asignación no encontrada' });
        }

        // Éxito
        res.json({ mensaje: 'Asignación eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar asignación:', error);
        res.status(500).json({ error: 'Error al eliminar asignación' });
    }
};

module.exports = {
    listarNeumaticosAsignados,
    eliminarAsignacion,
};
