const db = require("../config/db");

// Función utilitaria para formatear fechas (YYYY-MM-DD)
function formatDate(dateStr) {
    if (!dateStr) return null;
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
    return new Date(dateStr).toISOString().slice(0, 10);
}
// Función utilitaria para formatear timestamps (YYYY-MM-DD HH:MM:SS)
function formatTimestamp(dateStr) {
    if (!dateStr) return null;
    // Si ya está en formato correcto, retorna igual
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(dateStr)) return dateStr;
    // Si viene como ISO, reemplaza la T por espacio y quita los milisegundos
    return dateStr.replace('T', ' ').substring(0, 19);
}

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
                    formatDate(datos.FECHA_REGISTRO),
                    formatDate(datos.FECHA_COMPRA),
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
                    formatDate(datos.FECHA_ASIGNACION),
                    datos.KILOMETRO,
                    formatTimestamp(datos.FECHA_MOVIMIENTO),
                    datos.OBSERVACION
                ];
                //console.log('queryMantenimiento:', queryMantenimiento);
                //console.log('valoresMantenimiento (length=' + valoresMantenimiento.length + '):', valoresMantenimiento);
                // Mostrar cada valor con su índice para depuración
                // valoresMantenimiento.forEach((v, i) => {
                //     console.log(`  [${i}] (${typeof v}):`, v);
                // });
                await db.query(queryMantenimiento, valoresMantenimiento);

                // Formatear FECHA_ASIGNACION para que sea solo fecha (YYYY-MM-DD)
                const fechaAsignacion = formatDate(datos.FECHA_ASIGNACION);

                // Validar duplicidad antes de insertar en NEU_MOVIMIENTO
                // (Desactivado: ahora permite insertar aunque exista la misma combinación CODIGO y FECHA_ASIGNACION)
                // const checkQuery = `SELECT 1 FROM SPEED400AT.NEU_MOVIMIENTO WHERE CODIGO = ? AND FECHA_ASIGNACION = ?`;
                // const checkResult = await db.query(checkQuery, [datos.CODIGO, fechaAsignacion]);
                // if (checkResult.length > 0) {
                //     console.error('Registro duplicado detectado en NEU_MOVIMIENTO para CODIGO y FECHA_ASIGNACION:', datos.CODIGO, fechaAsignacion);
                //     throw new Error('Ya existe un movimiento para este neumático y fecha de asignación.');
                // }
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
                    formatDate(datos.FECHA_REGISTRO),
                    formatDate(datos.FECHA_COMPRA),
                    datos.USUARIO_SUPER || null,
                    "REUBICADO",
                    datos.PRESION_AIRE || null,
                    datos.TORQUE_APLICADO || null,
                    datos.ESTADO || null,
                    datos.PLACA || null,
                    datos.POSICION_FIN || null, 
                    fechaAsignacion,
                    datos.KILOMETRO || null,
                    formatTimestamp(datos.FECHA_MOVIMIENTO) || null,
                    null 
                ];
                //console.log('valoresMovimiento:', valoresMovimiento);
                await db.query(queryMovimiento, valoresMovimiento);
            } catch (e) {
                // Mostrar el error exacto de la base de datos en consola para depuración
                console.error('Error SQL en registro individual:', e);
                throw e;
            }
        }
        res.status(201).json({ mensaje: `Reubicación de ${datosArray.length} neumático(s) registrada correctamente` });
    } catch (error) {
        res.status(500).json({ error: "Error al registrar la reubicación de neumático(s)", detalle: error.message });
    }
};

module.exports = { registrarReubicacionNeumatico };
