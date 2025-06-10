const db = require("../config/db");

const asignarNeumatico = async (req, res) => {
    // Validar sesión y usuario autenticado
    if (!req.session.user || !req.session.user.usuario) {
        return res.status(401).json({ mensaje: "No autenticado" });
    }
    try {
        const {
            CodigoNeumatico, // P_CODIGO
            Remanente,      // P_REMANENTE
            PresionAire,    // P_PRESION_AIRE
            TorqueAplicado, // P_TORQUE_APLICADO
            Placa,          // P_PLACA
            Posicion,       // P_POSICION
            Odometro,       // P_KILOMETRO
            FechaRegistro   // P_FECHA_REGISTRO (nuevo)
            // UsuarioCrea se tomará de la sesión
        } = req.body;

        // Tomar el usuario autenticado de la sesión
        const UsuarioCrea = req.session.user.usuario.trim().toUpperCase();

        // Validación básica
        if (!CodigoNeumatico || !Remanente || !PresionAire || !TorqueAplicado || !Placa || !Posicion || !Odometro || !FechaRegistro) {
            console.warn("⚠️ Faltan campos requeridos.");
            return res.status(400).json({ error: "Faltan campos obligatorios (incluya FechaRegistro en formato YYYY-MM-DD)." });
        }

        // Validar formato de fecha (YYYY-MM-DD)
        if (!/^\d{4}-\d{2}-\d{2}$/.test(FechaRegistro)) {
            return res.status(400).json({ error: "El campo FechaRegistro debe tener formato YYYY-MM-DD." });
        }

        const query = `
            CALL SPEED400AT.SP_ASIGNAR_NEUMATICO(
                ${CodigoNeumatico},
                ${Remanente},
                ${PresionAire},
                ${TorqueAplicado},
                '${Placa}',
                '${Posicion}',
                ${Odometro},
                '${UsuarioCrea}',
                DATE('${FechaRegistro}')
            )
        `;

        //console.log("🧪 Ejecutando query:\n", query);

        const result = await db.query(query);
        //console.log("✅ Resultado de DB:", result);

        res.status(200).json({ mensaje: "Neumático asignado correctamente." });

    } catch (error) {
        // Imprime el error completo para depuración
        console.error("❌ Error al asignar neumático:", JSON.stringify(error, null, 2));
        const errorMsg = JSON.stringify(error);
        if (errorMsg.includes("ya se encuentra asignado a otro vehículo o posición")) {
            return res.status(409).json({
                error: "El neumático ya está asignado a otro vehículo o posición.",
                detalle: "El neumático ya se encuentra asignado a otro vehículo o posición."
            });
        }
        res.status(500).json({
            error: "Error al asignar neumático.",
            detalle: error.message,
        });
    }
};

module.exports = { asignarNeumatico };
