const db = require("../config/db");

const crearInspeccion = async (req, res) => {
    const datos = req.body;

    // Validar datos recibidos antes de continuar
    try {
        // 1. Obtener datos actuales del neumático asignado
        const queryDatosActuales = `SELECT KILOMETRO, REMANENTE FROM SPEED400AT.NEU_ASIGNADO WHERE CODIGO = ? OR PLACA = ? ORDER BY FECHA_ASIGNACION DESC FETCH FIRST 1 ROWS ONLY`;
        const result = await db.query(queryDatosActuales, [datos.CODIGO, datos.PLACA]);
        if (!result || result.length === 0) {
            return res.status(400).json({ error: "No se encontró el neumático asignado para validar (por CODIGO o PLACA)." });
        }
        const { KILOMETRO: kilometroActual, REMANENTE: remanenteOriginal } = result[0];

        // 2. Validar kilometro
        if (typeof datos.KILOMETRO === 'number' && datos.KILOMETRO < kilometroActual) {
            return res.status(400).json({ error: `El kilometro ingresado (${datos.KILOMETRO}) no puede ser menor al actual (${kilometroActual}).` });
        }
        // 3. Validar remanente
        if (typeof datos.REMANENTE === 'number' && datos.REMANENTE > remanenteOriginal) {
            return res.status(400).json({ error: `El remanente ingresado (${datos.REMANENTE}) no puede ser mayor al original (${remanenteOriginal}).` });
        }

        // Insertar en NEU_INSPECCION (sin ID_INSPECCION, autoincremental)
        const queryInspeccion = `
            INSERT INTO SPEED400AT.NEU_INSPECCION (
                CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, OBSERVACION, PROVEEDOR, FECHA_REGISTRO,
                FECHA_COMPRA, USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO, ESTADO,
                PLACA, POSICION_NEU, FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const valoresInspeccion = [
            datos.CODIGO, datos.MARCA, datos.MEDIDA, datos.DISEÑO, datos.REMANENTE,
            datos.PR, datos.CARGA, datos.VELOCIDAD, datos.FECHA_FABRICACION, datos.RQ, datos.OC,
            datos.PROYECTO, datos.COSTO, datos.OBSERVACION, datos.PROVEEDOR, datos.FECHA_REGISTRO,
            datos.FECHA_COMPRA, datos.USUARIO_SUPER, datos.TIPO_MOVIMIENTO, datos.PRESION_AIRE,
            datos.TORQUE_APLICADO, datos.ESTADO, datos.PLACA, datos.POSICION_NEU, datos.FECHA_ASIGNACION,
            datos.KILOMETRO, datos.FECHA_MOVIMIENTO
        ];

        // Insertar y obtener el nuevo ID_INSPECCION generado
        await db.query(queryInspeccion, valoresInspeccion);
        const idResult = await db.query('SELECT IDENTITY_VAL_LOCAL() AS ID_INSPECCION FROM SYSIBM.SYSDUMMY1');
        const nuevoIdInspeccion = idResult[0]?.ID_INSPECCION;

        // Insertar en NEU_MOVIMIENTO usando el nuevo ID_INSPECCION
        // Ajustar para incluir todos los campos requeridos por la tabla
        const queryMovimiento = `
            INSERT INTO SPEED400AT.NEU_MOVIMIENTO (
                ID_MOVIMIENTO, -- autoincremental, se omite
                CODIGO, MARCA, MEDIDA, DISEÑO, REMANENTE, PR, CARGA, VELOCIDAD,
                FECHA_FABRICACION, RQ, OC, PROYECTO, COSTO, PROVEEDOR, FECHA_REGISTRO, FECHA_COMPRA,
                USUARIO_SUPER, TIPO_MOVIMIENTO, PRESION_AIRE, TORQUE_APLICADO, ESTADO, PLACA, POSICION_NEU,
                FECHA_ASIGNACION, KILOMETRO, FECHA_MOVIMIENTO
            ) VALUES (
                DEFAULT, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
            )
        `;
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
            datos.TIPO_MOVIMIENTO || null,
            datos.PRESION_AIRE || null,
            datos.TORQUE_APLICADO || null,
            datos.ESTADO || null,
            datos.PLACA || null,
            datos.POSICION_NEU || null,
            datos.FECHA_ASIGNACION || null,
            datos.KILOMETRO || null,
            datos.FECHA_MOVIMIENTO || null
        ];

        await db.query(queryMovimiento, valoresMovimiento);

        res.status(201).json({ mensaje: "Inspección y movimiento registrados correctamente", idInspeccion: nuevoIdInspeccion });
    } catch (error) {
        console.error("Error al insertar inspección y movimiento:", error);
        res.status(500).json({ error: "Error al registrar inspección y movimiento" });
    }
};

module.exports = {
    crearInspeccion,
};