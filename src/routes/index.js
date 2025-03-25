const express = require("express"); 
 // Importa fs (file system), que nos permite trabajar con archivos del sistema 
 // (en este caso, para leer los archivos en la carpeta routes).
const fs = require("fs");

const router = express.Router(); // Crea un enrutador de express que se encargará de manejar las rutas.

const removeExtension = (fileName) => {
    // Esta función recibe un nombre de archivo (por ejemplo: 'users.js') y devuelve el nombre sin la extensión (en este caso 'users').
    return fileName.split('.').shift();
}

// Leemos todos los archivos de la carpeta actual (la carpeta 'routes')
fs.readdirSync(__dirname)

    .filter((file) => {
        const name = removeExtension(file); // Eliminamos la extensión del archivo para obtener solo el nombre (por ejemplo, 'users').
        
        if (name !== 'index') { // No queremos cargar el archivo index.js, porque este archivo sirve para cargar otras rutas.
            router.use('/' + name, require('./' + name)); 
        }
    });

module.exports = router; // Exportamos el enrutador para que pueda ser utilizado en otros archivos, como 'app.js'.
