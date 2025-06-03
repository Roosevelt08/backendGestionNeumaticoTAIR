const db = require("../config/db");

// Obtener el último movimiento de cada neumático instalado en una placa
const listarUltimosMovimientosPorPlaca = async (req, res) => {
    try {
        const { placa } = req.params;
        if (!placa || placa.trim() === "") {
            return res.status(400).json({ error: "La placa es requerida" });
        }
        const placaTrim = placa.trim();
        // Consulta: último movimiento por neumático y posición en la placa
        const query = `
      SELECT m.*
      FROM SPEED400AT.NEU_MOVIMIENTO m
      INNER JOIN (
        SELECT CODIGO, POSICION_NEU, MAX(FECHA_MOVIMIENTO) AS FECHA_MAX
        FROM SPEED400AT.NEU_MOVIMIENTO
        WHERE TRIM(PLACA) = ?
        GROUP BY CODIGO, POSICION_NEU
      ) ult
        ON m.CODIGO = ult.CODIGO
        AND m.POSICION_NEU = ult.POSICION_NEU
        AND m.FECHA_MOVIMIENTO = ult.FECHA_MAX
      WHERE TRIM(m.PLACA) = ?
      ORDER BY m.POSICION_NEU
    `;
        const result = await db.query(query, [placaTrim, placaTrim]);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener últimos movimientos de neumáticos:", error);
        res.status(500).json({ error: "Error al obtener últimos movimientos de neumáticos" });
    }
};

// Obtener el último movimiento de cada posición de un neumático por su código
const listarUltimosMovimientosPorCodigo = async (req, res) => {
    try {
        const { codigo } = req.params;
        if (!codigo || codigo.trim() === "") {
            return res.status(400).json({ error: "El código es requerido" });
        }
        const codigoTrim = codigo.trim();
        // Consulta: último movimiento por posición para el neumático
        const query = `
      SELECT m.*
      FROM SPEED400AT.NEU_MOVIMIENTO m
      INNER JOIN (
        SELECT POSICION_NEU, MAX(FECHA_MOVIMIENTO) AS FECHA_MAX
        FROM SPEED400AT.NEU_MOVIMIENTO
        WHERE TRIM(CODIGO) = ?
        GROUP BY POSICION_NEU
      ) ult
        ON m.POSICION_NEU = ult.POSICION_NEU
        AND m.FECHA_MOVIMIENTO = ult.FECHA_MAX
      WHERE TRIM(m.CODIGO) = ?
      ORDER BY m.FECHA_MOVIMIENTO DESC
    `;
        const result = await db.query(query, [codigoTrim, codigoTrim]);
        res.json(result);
    } catch (error) {
        console.error("Error al obtener últimos movimientos por código:", error);
        res.status(500).json({ error: "Error al obtener últimos movimientos por código" });
    }
};

module.exports = {
    listarUltimosMovimientosPorPlaca,
    listarUltimosMovimientosPorCodigo,
};
