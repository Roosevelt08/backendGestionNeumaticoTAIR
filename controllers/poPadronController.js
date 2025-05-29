const db = require("../config/db");
const xlsx = require("xlsx");

const cargarPadronDesdeExcel = async (req, res) => {
    try {
        // Leer archivo desde buffer en memoria (multer memoryStorage)
        const bufferExcel = req.file?.buffer;
        if (!bufferExcel) {
            return res.status(400).json({ error: 'No se recibió ningún archivo.' });
        }

        // Leer el archivo Excel desde buffer
        const workbook = xlsx.read(bufferExcel, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(worksheet, { defval: '', raw: false });

        if (data.length === 0) {
            return res.status(400).json({ error: "El archivo Excel está vacío." });
        }

        // Obtener los nombres de las columnas
        const encabezados = Object.keys(data[0]);

        // Utilidad para limpiar encabezados
        function limpiarEncabezado(str) {
            return str.toUpperCase().replace(/\s+/g, ' ').replace(/\n/g, ' ').trim();
        }
        // Mapeo dinámico de columnas tolerante a espacios y saltos de línea
        const columnas = {
            CODIGO: encabezados.find(col => limpiarEncabezado(col).includes("CODIGO")),
            MARCA: encabezados.find(col => limpiarEncabezado(col).includes("MARCA")),
            MEDIDA: encabezados.find(col => limpiarEncabezado(col).includes("MEDIDA")),
            DISENO: encabezados.find(col => limpiarEncabezado(col).includes("DISEÑO") || limpiarEncabezado(col).includes("DISENO")),
            REMANENTE: encabezados.find(col => limpiarEncabezado(col).includes("REMANENTE")),
            PR: encabezados.find(col => limpiarEncabezado(col).includes("PR")),
            CARGA: encabezados.find(col => limpiarEncabezado(col).includes("CARGA")),
            VELOCIDAD: encabezados.find(col => limpiarEncabezado(col).includes("VELOCIDAD")),
            FECHA_FABRICACION_COD: encabezados.find(col => limpiarEncabezado(col).includes("FECHA FABRICACION") || limpiarEncabezado(col).includes("FECHA FABRICACIÓN")),
            RQ: encabezados.find(col => limpiarEncabezado(col).includes("RQ")),
            OC: encabezados.find(col => limpiarEncabezado(col).includes("OC")),
            PROYECTO: encabezados.find(col => limpiarEncabezado(col).includes("PROYECTO")),
            COSTO: encabezados.find(col => limpiarEncabezado(col).includes("COSTO")),
            PROVEEDOR: encabezados.find(col => limpiarEncabezado(col).includes("PROVEEDOR")),
            FECHA_COMPRA: encabezados.find(col => limpiarEncabezado(col).includes("FECHA COMPRA"))
        };

        // Si no hay ninguna columna reconocida, rechazar
        if (Object.values(columnas).every(col => !col)) {
            return res.status(400).json({ error: "El archivo Excel no contiene ninguna columna reconocida." });
        }

        let insertados = 0;
        let errores = [];

        for (const fila of data) {
            let erroresFila = [];
            let codigo = columnas.CODIGO ? (fila[columnas.CODIGO] || '').toString().trim() : null;
            if (codigo) {
                // Forzar schema SPEED400AT
                const existe = await db.query('SELECT 1 FROM SPEED400AT.PO_NEUMATICO WHERE CODIGO = ?', [codigo]);
                if (existe && existe.length > 0) {
                    erroresFila.push('Código duplicado: ya existe en la base de datos.');
                }
            } else {
                erroresFila.push('Código no especificado.');
            }

            let marca = columnas.MARCA ? (fila[columnas.MARCA] || '').trim() : null;
            if (marca) {
                // Forzar schema SPEED400AT
                const existeMarca = await db.query('SELECT 1 FROM SPEED400AT.NEU_MARCA WHERE UPPER(MARCA) = ?', [marca.toUpperCase()]);
                if (!existeMarca || existeMarca.length === 0) {
                    erroresFila.push(`Marca inválida o mal escrita: '${marca}'.`);
                }
            } else {
                erroresFila.push('Marca no especificada.');
            }

            let medida = columnas.MEDIDA ? (fila[columnas.MEDIDA] || '').trim() : null;
            if (medida) {
                const existeMedida = await db.query('SELECT 1 FROM SPEED400AT.NEU_MEDIDA WHERE MEDIDA = ?', [medida]);
                if (!existeMedida || existeMedida.length === 0) {
                    erroresFila.push(`Medida inválida o mal escrita: '${medida}'.`);
                }
            } else {
                erroresFila.push('Medida no especificada.');
            }

            let diseno = columnas.DISENO ? (fila[columnas.DISENO] || '').trim() : null;
            if (diseno) {
                const existeDiseno = await db.query('SELECT 1 FROM SPEED400AT.NEU_DISENO WHERE DISENO = ?', [diseno]);
                if (!existeDiseno || existeDiseno.length === 0) {
                    erroresFila.push(`Diseño inválido o mal escrito: '${diseno}'.`);
                }
            } else {
                erroresFila.push('Diseño no especificado.');
            }

            if (erroresFila.length > 0) {
                errores.push({ fila: codigo || '', mensaje: erroresFila.join(' ') });
                continue;
            }

            try {
                // Obtener IDs de marca, medida y diseño
                let idMarca = null;
                if (marca) {
                    const resMarca = await db.query('SELECT ID_MARCA FROM SPEED400AT.NEU_MARCA WHERE UPPER(MARCA) = ?', [marca.toUpperCase()]);
                    if (resMarca && resMarca.length > 0) idMarca = resMarca[0].ID_MARCA;
                }
                let idMedida = null;
                if (medida) {
                    const resMedida = await db.query('SELECT ID_MEDIDA FROM SPEED400AT.NEU_MEDIDA WHERE MEDIDA = ?', [medida]);
                    if (resMedida && resMedida.length > 0) idMedida = resMedida[0].ID_MEDIDA;
                }
                let idDiseno = null;
                if (diseno) {
                    const resDiseno = await db.query('SELECT ID_DISENO FROM SPEED400AT.NEU_DISENO WHERE DISENO = ?', [diseno]);
                    if (resDiseno && resDiseno.length > 0) idDiseno = resDiseno[0].ID_DISENO;
                }

                const filaLimpia = {
                    CODIGO: columnas.CODIGO ? (fila[columnas.CODIGO] || '').toString().trim() : null,
                    MARCA: columnas.MARCA ? (fila[columnas.MARCA] || '').trim() : null,
                    MEDIDA: columnas.MEDIDA ? (fila[columnas.MEDIDA] || '').trim() : null,
                    DISENO: columnas.DISENO ? (fila[columnas.DISENO] || '').trim() : null,
                    REMANENTE: columnas.REMANENTE ? (parseInt(fila[columnas.REMANENTE]) || 0) : null,
                    PR: columnas.PR ? (fila[columnas.PR] || '').toString().trim() : null,
                    CARGA: columnas.CARGA ? (fila[columnas.CARGA] || '').toString().trim() : null,
                    VELOCIDAD: columnas.VELOCIDAD ? (fila[columnas.VELOCIDAD] || '').trim() : null,
                    FECHA_FABRICACION_COD: columnas.FECHA_FABRICACION_COD ? (fila[columnas.FECHA_FABRICACION_COD] || '').toString().trim() : null,
                    RQ: columnas.RQ ? (fila[columnas.RQ] || '').toString().trim() : null,
                    OC: columnas.OC ? (fila[columnas.OC] || '').toString().trim() : null,
                    PROYECTO: columnas.PROYECTO ? (fila[columnas.PROYECTO] || '').trim() : null,
                    COSTO: columnas.COSTO ? (parseFloat(fila[columnas.COSTO]) || 0) : null,
                    PROVEEDOR: columnas.PROVEEDOR ? (fila[columnas.PROVEEDOR] || '').trim() : null,
                    FECHA_COMPRA: columnas.FECHA_COMPRA && fila[columnas.FECHA_COMPRA]
                        ? (() => {
                            const valor = fila[columnas.FECHA_COMPRA];
                            if (typeof valor === 'number') {
                                // Fecha Excel numérica
                                const fecha = new Date(Date.UTC(1899, 11, 30) + valor * 86400000);
                                return fecha.toISOString().split('T')[0];
                            }
                            if (typeof valor === 'string') {
                                const v = valor.trim();
                                if (/^\d{2}\/\d{2}\/\d{4}$/.test(v)) {
                                    const [dia, mes, anio] = v.split('/');
                                    return `${anio}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
                                }
                                const d = new Date(v);
                                return isNaN(d) ? null : d.toISOString().split('T')[0];
                            }
                            return null;
                        })()
                        : null,
                    ID_MARCA: idMarca,
                    ID_MEDIDA: idMedida,
                    ID_DISENO: idDiseno
                };

                const query = `CALL SPEED400AT.SP_INSERTAR_PO_NEUMATICO(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const params = [
                    filaLimpia.CODIGO, filaLimpia.MARCA, filaLimpia.MEDIDA, filaLimpia.DISENO,
                    filaLimpia.REMANENTE, filaLimpia.PR, filaLimpia.CARGA, filaLimpia.VELOCIDAD,
                    filaLimpia.FECHA_FABRICACION_COD, filaLimpia.RQ, filaLimpia.OC, filaLimpia.PROYECTO,
                    filaLimpia.COSTO, filaLimpia.PROVEEDOR, filaLimpia.FECHA_COMPRA
                ];
                await db.query(query, params);
                insertados++;
            } catch (error) {
                errores.push({ fila: codigo || '', mensaje: error.message || "Error desconocido" });
            }
        }

        let mensajeFinal = insertados === data.length
            ? "Padrón actualizado correctamente. Todos los registros fueron insertados."
            : insertados === 0
            ? "Carga no realizada. Todos los registros tienen errores."
            : `Carga parcial: ${insertados} insertados de ${data.length} registros.`;

        // Siempre responder 200 con el detalle de errores de filas
        return res.status(200).json({ mensaje: mensajeFinal, total: data.length, insertados, errores });
    } catch (err) {
        // Solo aquí devolver 500 si el error es global (por ejemplo, archivo corrupto, sin conexión, etc)
        console.error("Error general:", err);
        res.status(500).json({ error: "Error al procesar el padrón", detalle: err.message });
    }
};

module.exports = { cargarPadronDesdeExcel };
