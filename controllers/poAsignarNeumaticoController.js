const db = require("../config/db");

const asignarNeumatico = async (req, res) => {
    try {
        const { Placa, Posicion, CodigoNeumatico, Odometro, Observacion } = req.body;

        console.log("📥 Datos recibidos:", {
            Placa,
            Posicion,
            CodigoNeumatico,
            Odometro,
            Observacion,
        });

        if (!Placa || !Posicion || !CodigoNeumatico) {
            console.warn("⚠️ Faltan campos requeridos.");
            return res.status(400).json({ error: "Faltan campos obligatorios." });
        }

        const query = `     
            CALL SPEED400AT.SP_ASIGNAR_NEUMATICO(   
                '${Placa}',
                '${Posicion}',
                ${CodigoNeumatico},
                ${Odometro || 0},
                '${Observacion || ''}'
            )
        `;

        console.log("🧪 Ejecutando query:\n", query);

        const result = await db.query(query);
        console.log("✅ Resultado de DB:", result);

        res.status(200).json({ mensaje: "Neumático asignado correctamente." });

    } catch (error) {
        console.error("❌ Error al asignar neumático:", error);
        res.status(500).json({
            error: "Error a asignar neumático.",
            detalle: error.message,
        });
    }
};

module.exports = { asignarNeumatico };
