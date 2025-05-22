const db = require('../config/db');

const login = async (req, res) => {
    const { usuario, password } = req.body;
    try {
        const users = await db.query(
            `SELECT CH_CODI_USUARIO, VC_DESC_NOMB_USUARIO, VC_DESC_APELL_PATERNO, VC_DESC_APELL_MATERNO, CH_PASS_USUA, CH_ESTA_ACTIVO
             FROM SPEED400AT.MAE_USUARIO
             WHERE CH_CODI_USUARIO = ?`,
            [usuario]
        );
        const user = users[0];
        // Agrega logs para depuración
        console.log('Usuario encontrado:', user);
        console.log('Password recibido:', password);

        if (!user || String(user.CH_PASS_USUA).trim() !== String(password).trim()) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }
        if (user.CH_ESTA_ACTIVO !== 'A') {
            return res.status(403).json({ error: 'Usuario inactivo' });
        }

        const perfiles = await db.query(
            `SELECT P.CH_CODI_PERFIL, PF.VC_DESC_PERFIL
             FROM SPEED400AT.MAE_PERFIL_MAE_USUARIO P
             JOIN SPEED400AT.MAE_PERFIL PF ON P.CH_CODI_PERFIL = PF.CH_CODI_PERFIL
             WHERE P.CH_CODI_USUARIO = ? AND P.CH_ESTA_PERFIL_USUA = 'A' AND PF.CH_ESTA_PERFIL = 'A'`,
            [usuario]
        );

        // Guarda el usuario en la sesión
        req.session.user = {
            usuario: user.CH_CODI_USUARIO,
            nombre: user.VC_DESC_NOMB_USUARIO,
            apellido_paterno: user.VC_DESC_APELL_PATERNO,
            apellido_materno: user.VC_DESC_APELL_MATERNO,
            perfiles: perfiles.map(p => ({
                codigo: p.CH_CODI_PERFIL,
                descripcion: p.VC_DESC_PERFIL
            }))
        };

        res.json(req.session.user);
    } catch (error) {
        res.status(500).json({ error: 'Error en el login' });
    }
};

module.exports = { login };