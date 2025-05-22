const db = require("../config/db");

const buscarVehiculoPorPlaca = async (req, res) => {
  try {
    const { placa } = req.params; // Obtén el parámetro de la URL

    const query = `CALL SPEED400AT.SP_OBTENER_VEHICULO_POR_PLACA(?)`;
    const [result] = await db.query(query, [placa]);

    //console.log("Resultado del procedimiento almacenado:", result); // Log para verificar el formato

    // Verifica si el resultado no está vacío
    if (result && Object.keys(result).length > 0) {
      res.json(result); // Devuelve el resultado completo
    } else {
      res.status(404).json({ mensaje: "Vehículo no encontrado" });
    }
  } catch (error) {
    console.error("❌ Error al buscar vehículo:", error);
    res.status(500).json({ error: "Error al buscar vehículo por placa" });
  }
};

module.exports = {
  buscarVehiculoPorPlaca,
};
