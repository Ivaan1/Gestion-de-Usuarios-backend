const express = require("express"); 

const fs = require("fs");

const router = express.Router(); 

const removeExtension = (fileName) => {
    // Esta función recibe un nombre de archivo (por ejemplo: 'users.js') y devuelve el nombre sin la extensión (en este caso 'users').
    return fileName.split('.').shift();
}

// Leemos todos los archivos de la carpeta actual (la carpeta 'routes')
fs.readdirSync(__dirname)

    .filter((file) => {
        const name = removeExtension(file); // Eliminamos la extensión del archivo para obtener solo el nombre (por ejemplo, 'users').
        
        return name !== 'index';
    }).forEach((file) => {
        const name = removeExtension(file);
        router.use('/' + name, require('./' + name));  // http://localhost:5000/api/tracks
    });

module.exports = router; // Exportamos el enrutador para que pueda ser utilizado en otros archivos, como 'app.js'.
