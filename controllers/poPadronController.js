const xlsx = require("xlsx");
const db = require("../config/db");
const path = require("path");

const cargarPadronDesdeExcel = async (req, res) => {
    try {
        const rutaExcel = req.file?.path;
        if (!rutaExcel) {
            return res.status(400).json({ error: 'No se recibió ningún archivo.' });
        }

        const workbook = xlsx.readFile(rutaExcel);
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, {
            defval: '',
            raw: false,
        });

        console.log('📁 Ruta Excel:', rutaExcel);

        let insertados = 0;
        let errores = [];

        for (const fila of data) {
            const filaLimpia = {
                CODIGO: parseInt(fila.CODIGO),
                MARCA: fila.MARCA.trim(),
                MEDIDA: fila.MEDIDA.trim(),
                DISENO: fila.DISEÑO.trim(),
                REMANENTE: parseInt(fila.REMANENTE),
                PR: parseInt(fila.PR),
                CARGA: parseInt(fila.CARGA),
                VELOCIDAD: fila.VELOCIDAD.trim(),
                RQ: parseInt(fila.RQ),
                OC: fila.OC || 0, // Si OC puede ser nulo, envía 0 como valor por defecto
                PROYECTO: fila.PROYECTO.trim(),
                COSTO: parseFloat(fila.COSTO),
                PROVEEDOR: fila.PROVEEDOR.trim(),
                FECHA: new Date(fila.FECHA).toISOString().split('T')[0],
                USUARIO_SUPER: fila.USUARIO_SUPER ? fila.USUARIO_SUPER.trim() : '',
                USUARIO_CARGA: 'sistema',
                ARCHIVO_ORIGEN: req.file.originalname,
                FILA: parseInt(fila.CODIGO)
            };

            const erroresFila = [];

            // Validar si el código ya existe
            const [existeCodigo] = await db.query(`SELECT 1 FROM SPEED400AT.PO_NEUMATICO WHERE CODIGO = ?`, [filaLimpia.CODIGO]);
            if (existeCodigo) {
                erroresFila.push(`El código ${filaLimpia.CODIGO} ya existe en la base de datos.`);
            }

            // Si ya hay un error, no continuar con las demás validaciones
            if (erroresFila.length === 0) {
                // Validar si la marca está registrada
                const [existeMarca] = await db.query(`SELECT 1 FROM SPEED400AT.MARCA_NEUMATICO WHERE NOMBRE = ?`, [filaLimpia.MARCA]);
                if (!existeMarca) {
                    erroresFila.push(`La marca "${filaLimpia.MARCA}" no está registrada.`);
                }
            }

            // Si ya hay un error, no continuar con las demás validaciones
            if (erroresFila.length === 0) {
                // Validar si el proveedor está registrado
                const [existeProveedor] = await db.query(`SELECT 1 FROM SPEED400AT.PROVEEDOR_NEUMATICO WHERE NOMBRE = ?`, [filaLimpia.PROVEEDOR]);
                if (!existeProveedor) {
                    erroresFila.push(`El proveedor "${filaLimpia.PROVEEDOR}" no está registrado.`);
                }
            }

            // Si ya hay un error, no continuar con las demás validaciones
            if (erroresFila.length === 0) {
                // Validar si el proyecto tiene un responsable asignado
                const [existeProyecto] = await db.query(`
                    SELECT CH_CODI_RESPONSABLE
                    FROM SPEED400AT.PO_TALLER
                    WHERE DESCRIPCION = ?
                `, [filaLimpia.PROYECTO]);
                if (!existeProyecto || !existeProyecto.CH_CODI_RESPONSABLE) {
                    erroresFila.push(`El proyecto "${filaLimpia.PROYECTO}" no existe o no tiene un responsable asignado.`);
                }
            }

            // Si hay errores en la fila, los agregamos al array de errores y continuamos con la siguiente fila
            if (erroresFila.length > 0) {
                errores.push({
                    fila: filaLimpia.CODIGO,
                    mensaje: erroresFila[0] // Solo mostrar el primer error
                });
                continue;
            }

            console.log("⚙️ Ejecutando SP con datos:", filaLimpia);
            try {
                const query = `CALL SPEED400AT.SP_INSERTAR_PADRON_NEUMATICO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const params = [
                    filaLimpia.CODIGO,
                    filaLimpia.MARCA,
                    filaLimpia.MEDIDA,
                    filaLimpia.DISENO,
                    filaLimpia.REMANENTE,
                    filaLimpia.PR,
                    filaLimpia.CARGA,
                    filaLimpia.VELOCIDAD,
                    filaLimpia.RQ,
                    filaLimpia.OC,
                    filaLimpia.PROYECTO,
                    filaLimpia.COSTO,
                    filaLimpia.PROVEEDOR,
                    filaLimpia.FECHA
                ];

                console.log("🧾 Query:", query);
                try {
                    await db.query(query, params);
                    insertados++;
                } catch (error) {
                    const mensajeError = error?.message || error?.sqlMessage || 'Error desconocido';
                    console.error("❌ Error al insertar fila:", mensajeError);
                    errores.push({
                        fila: filaLimpia.CODIGO,
                        mensaje: mensajeError
                    });
                }
            } catch (error) {
                const mensajeError = error?.message || error?.sqlMessage || 'Error desconocido';
                console.error("❌ Error al insertar fila:", mensajeError);
                errores.push({
                    fila: filaLimpia.CODIGO,
                    mensaje: mensajeError
                });
            }
        }

        let mensajeFinal = "";

        if (insertados === data.length) {
            mensajeFinal = "Padrón actualizado correctamente. Todos los registros fueron insertados.";
        } else if (insertados === 0 && errores.length > 0) {
            mensajeFinal = "Carga no realizada. Todos los registros tienen errores.";
        } else {
            mensajeFinal = `Carga parcial: ${insertados} insertados de ${data.length} registros.`;
        }

        res.json({
            mensaje: "Carga finalizada",
            total: data.length,
            insertados,
            errores
        });

    } catch (err) {
        console.error("Error general:", err);
        res.status(500).json({
            error: "Error al procesar el padrón",
            detalle: err.message,
        });
    }
};

module.exports = { cargarPadronDesdeExcel };
