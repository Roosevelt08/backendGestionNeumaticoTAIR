const db = require("../config/db");

const registrarReubicacionNeumatico = async (req, res) => {
    try {
        const datosArray = Array.isArray(req.body) ? req.body : [req.body];
        const queryMantenimiento = `
            INSERT INTO SPEED400AT.NEU_MANTENIMIENTO (
                CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, PROVEEDOR, FECHA_REGISTRO,
                FECHA_COMPRA, USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO,
                ESTADO, PLACA, POSICION_NEU, POSICION_INICIAL, POSICION_FIN, DESTINO,
                FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO, OBSERVACION
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const queryMovimiento = `
            INSERT INTO SPEED400AT.NEU_MOVIMIENTO (
                CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, PROVEEDOR, FECHA_REGISTRO, FECHA_COMPRA,
                USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO, ESTADO, PLACA, POSICION_NEU,
                FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO, ID_ASIGNADO
            ) VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;
        for (const datos of datosArray) {
            try {
                const valoresMantenimiento = [
                    datos.CODIGO,
                    datos.MARCA,
                    datos.MEDIDA,
                    datos.DISEÑO,
                    datos.REMANENTE,
                    datos.PR,
                    datos.CARGA,
                    datos.VELOCIDAD,
                    datos.FECHA_FABRICACION,
                    datos.RQ,
                    datos.OC,
                    datos.PROYECTO,
                    datos.COSTO,
                    datos.PROVEEDOR,
                    datos.FECHA_REGISTRO,
                    datos.FECHA_COMPRA,
                    datos.USUARIO_SUPER,
                    "REUBICADO",
                    datos.PRESION_AIRE,
                    datos.TORQUE_APLICADO,
                    datos.ESTADO,
                    datos.PLACA,
                    datos.POSICION_NEU, // POSICION_NEU
                    datos.POSICION_INICIAL, // POSICION_INICIAL
                    datos.POSICION_FIN, // POSICION_FIN
                    datos.DESTINO,
                    datos.FECHA_ASIGNACION,
                    datos.KILOMETRO,
                    datos.FECHA_MOVIMIENTO,
                    datos.OBSERVACION
                ];
                //console.log('queryMantenimiento:', queryMantenimiento);
                //console.log('valoresMantenimiento (length=' + valoresMantenimiento.length + '):', valoresMantenimiento);
                // Mostrar cada valor con su índice para depuración
                valoresMantenimiento.forEach((v, i) => {
                    console.log(`  [${i}] (${typeof v}):`, v);
                });
                await db.query(queryMantenimiento, valoresMantenimiento);

                // Formatear FECHA_ASIGNACION para que sea solo fecha (YYYY-MM-DD)
                const fechaAsignacion = datos.FECHA_ASIGNACION ? datos.FECHA_ASIGNACION.split('T')[0] : null;

                const valoresMovimiento = [
                    datos.CODIGO || null,
                    datos.MARCA || null,
                    datos.MEDIDA || null,
                    datos.DISEÑO || null,
                    datos.REMANENTE || null,
                    datos.PR || null,
                    datos.CARGA || null,
                    datos.VELOCIDAD || null,
                    datos.FECHA_FABRICACION || null,
                    datos.RQ || null,
                    datos.OC || null,
                    datos.PROYECTO || null,
                    datos.COSTO || null,
                    datos.PROVEEDOR || null,
                    datos.FECHA_REGISTRO || null,
                    datos.FECHA_COMPRA || null,
                    datos.USUARIO_SUPER || null,
                    "REUBICADO",
                    datos.PRESION_AIRE || null,
                    datos.TORQUE_APLICADO || null,
                    datos.ESTADO || null,
                    datos.PLACA || null,
                    datos.POSICION_FIN || null, // POSICION_NEU final (POSICION_FIN)
                    fechaAsignacion,
                    datos.KILOMETRO || null,
                    datos.FECHA_MOVIMIENTO || null,
                    null // ID_ASIGNADO debe ser null explícitamente
                ];
                //console.log('valoresMovimiento:', valoresMovimiento);
                await db.query(queryMovimiento, valoresMovimiento);
            } catch (e) {
                //console.error('Error en registro individual:', e);
                throw e;
            }
        }
        res.status(201).json({ mensaje: `Reubicación de ${datosArray.length} neumático(s) registrada correctamente` });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la reubicación de neumático(s)", detalle: error.message });
    }
};

module.exports = { registrarReubicacionNeumatico };
