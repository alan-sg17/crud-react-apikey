const { Sequelize } = require('sequelize');
const sequelize = new Sequelize(
    'tarea',
    'root',
    '',
    {
        host: 'localhost',
        dialect: 'mysql',
        logging: false,
    }
);

async function connectDB() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la base de datos MySQL con Sequelize establecida correctamente.');
    } catch (error) {
        console.error('Error al conectar a la base de datos con Sequelize:', error);
        process.exit(1);
    }
}
module.exports = { sequelize, connectDB };