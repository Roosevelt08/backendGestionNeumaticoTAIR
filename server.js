const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require("./config/db");
const session = require('express-session');

const poNeumaticoRoutes = require('./routes/poNeumaticoRoutes');
const poSupervisoresRoutes = require('./routes/poSupervisorRoutes');
const padronRoutes = require('./routes/poPadron');
const poBuscarVehiculoRoutes = require('./routes/poBuscarVehiculoRoutes');
const poAsignadosRoutes = require('./routes/poAsignadosRoutes');
const poAsignarNeumaticoRoutes = require('./routes/poAsignarNeumaticoRoutes');
const poInicioSesionRoutes = require('./routes/poInicioSesionRoutes'); 

const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();
app.use(cors({
  origin: 'http://192.168.5.207:3000', 
  credentials: true
}));
app.use(express.json());

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Neumáticos TAIR",
      version: "1.0.0",
      description: "Documentación de la API para la gestión de neumáticos.",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));



// Configura express-session
app.use(session({
  secret: process.env.SESSION_SECRET, // Usar variable de entorno
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // true si usas HTTPS
    httpOnly: true,
    sameSite: 'lax'
  }
}));

// Rutas API
app.use("/api", poInicioSesionRoutes); 
app.use("/api/po-neumaticos", poNeumaticoRoutes);
app.use("/api/po-asignados", poAsignadosRoutes);
app.use("/api/po-supervisores", poSupervisoresRoutes);
app.use("/api/po-padron", padronRoutes);
app.use("/api/vehiculo", poBuscarVehiculoRoutes);
app.use("/api/asignar-neumatico", poAsignarNeumaticoRoutes);




// Servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, "0.0.0.0", async () => {
  console.log(`🟢 Servidor corriendo en http://0.0.0.0:${PORT}`);
  await db.connect();
});
