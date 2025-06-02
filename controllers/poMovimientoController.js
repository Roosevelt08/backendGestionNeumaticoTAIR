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

module.exports = {
    listarUltimosMovimientosPorPlaca,
};
