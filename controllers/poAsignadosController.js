const db = require("../config/db");

const listarNeumaticosAsignados = async (req, res) => {
    try {
        const { placa } = req.params;

        if (!placa || placa.trim() === "") {
            return res.status(400).json({ error: "La placa es requerida" });
        }

        // Hacemos el TRIM de la placa en el backend para evitar problemas con el parámetro en DB2
        const placaTrim = placa.trim();
        const query = `SELECT * FROM SPEED400AT.NEU_ASIGNADO WHERE TRIM(PLACA) = ?`;
        console.log(`🟡 Ejecutando query directa: ${query} con placa: ${placaTrim}`);

        const result = await db.query(query, [placaTrim]);
        console.log("🔵 Resultado crudo de la consulta directa:", JSON.stringify(result, null, 2));

        // Detectar si el resultado es un array, o si viene en result.rows o result.recordset
        let data = result;
        if (result && typeof result === 'object') {
            if (Array.isArray(result)) {
                data = result;
            } else if (Array.isArray(result.rows)) {
                data = result.rows;
            } else if (Array.isArray(result.recordset)) {
                data = result.recordset;
            } else {
                // Si es un solo objeto, lo envolvemos en array
                data = [result];
            }
        }
        res.json(data);
    } catch (error) {
        console.error("❌ Error al consultar NEU_ASIGNADO:", error);
        res.status(500).json({ error: error.message || "Error al obtener neumáticos asignados" });
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
