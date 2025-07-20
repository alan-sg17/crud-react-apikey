require('dotenv').config();

const express = require("express");
const app = express();
const { connectDB, sequelize } = require("./config/sequelizeConfig");
const cors = require('cors');
app.use(cors());
app.use(express.json());
const taskRoutes = require("./routes/taskRoutes");
app.use("/tasks", taskRoutes);
sequelize.sync()
    .then(() => {
        connectDB().then(() => {
            app.listen(3000, () => {
                console.log("Servidor corriendo en http://localhost:3000");
            });
        });
    })
    .catch(error => {
        console.error("Error al sincronizar modelos o conectar la base de datos:", error);
        process.exit(1);
    });