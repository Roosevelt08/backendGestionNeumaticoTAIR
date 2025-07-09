const db = require("../config/db");

const listarNeumaticosAsignados = async (req, res) => {
    try {
        const { placa } = req.params;

        if (!placa || placa.trim() === "") {
            return res.status(400).json({ error: "La placa es requerida" });
        }

        const placaTrim = placa.trim();
        // Consulta: solo el neumático vigente por posición (mayor FECHA_ASIGNACION), y último movimiento no sea BAJA DEFINITIVA
        const query = `
            SELECT na.*
            FROM SPEED400AT.NEU_ASIGNADO na
            LEFT JOIN SPEED400AT.NEU_MOVIMIENTO nm
              ON nm.CODIGO = na.CODIGO
              AND nm.FECHA_MOVIMIENTO = (
                  SELECT MAX(nm2.FECHA_MOVIMIENTO)
                  FROM SPEED400AT.NEU_MOVIMIENTO nm2
                  WHERE nm2.CODIGO = na.CODIGO
              )
            WHERE TRIM(na.PLACA) = ?
              AND (nm.TIPO_MOVIMIENTO IS NULL OR UPPER(TRIM(nm.TIPO_MOVIMIENTO)) <> 'BAJA DEFINITIVA')
              AND na.FECHA_ASIGNACION = (
                  SELECT MAX(na2.FECHA_ASIGNACION)
                  FROM SPEED400AT.NEU_ASIGNADO na2
                  WHERE na2.PLACA = na.PLACA
                    AND na2.POSICION_NEU = na.POSICION_NEU
              )
        `;
        //console.log(`🟡 Ejecutando query filtrada: ${query} con placa: ${placaTrim}`);

        const result = await db.query(query, [placaTrim]);
        //console.log("🔵 Resultado crudo de la consulta filtrada:", JSON.stringify(result, null, 2));

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

const listarNeumaticosAsignadosPorCodigo = async (req, res) => {
    try {
        const { codigo } = req.params;

        if (!codigo || codigo.trim() === "") {
            return res.status(400).json({ error: "El código del neumático es requerido" });
        }

        // Hacemos el TRIM del código en el backend para evitar problemas con el parámetro en DB2
        const codigoTrim = codigo.trim();
        const query = `SELECT * FROM SPEED400AT.NEU_ASIGNADO WHERE TRIM(CODIGO) = ?`;

        const result = await db.query(query, [codigoTrim]);

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
        console.error("❌ Error al consultar NEU_ASIGNADO por código:", error);
        res.status(500).json({ error: error.message || "Error al obtener neumáticos asignados por código" });
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
    listarNeumaticosAsignadosPorCodigo,
    eliminarAsignacion,
};
