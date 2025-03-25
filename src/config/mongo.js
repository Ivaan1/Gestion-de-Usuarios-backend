const mongoose = require('mongoose');

// Función para conectar a la base de datos MongoDB
const dbConnect = () => {
    // Obtén la URI de conexión desde las variables de entorno (que debes definir en tu archivo .env)
    const db_uri = process.env.DB_URI;

    // Configuración para evitar advertencias relacionadas con el uso de consultas estrictas en Mongoose
    mongoose.set('strictQuery', false);

    // Intenta conectar a la base de datos
    try {
        // Conexión a MongoDB usando la URI proporcionada
        mongoose.connect(db_uri, { useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
                console.log("Conexión exitosa a la base de datos");
            })
            .catch((error) => {
                console.error("Error conectando a la BD:", error); // Manejo del error en caso de fallo
            });
            
    } catch (error) {
        console.error("Error al intentar conectar a la base de datos:", error); // En caso de algún fallo en el try
    }

    // Eventos de Mongoose para manejar la conexión
    mongoose.connection.on("connected", () => {
        console.log("Conectado a la BD"); // Imprime mensaje cuando la conexión es exitosa
    });

    mongoose.connection.on("error", (error) => {
        console.error("Error de conexión a la BD:", error); // Imprime mensaje si ocurre un error de conexión
    });

    mongoose.connection.on("disconnected", () => {
        console.log("Desconectado de la BD"); // Imprime mensaje cuando la conexión se cierra
    });
}

// Exporta la función para ser utilizada en otros archivos
module.exports = dbConnect;
