
// Importar todos los modelos de la carpeta 'nosql'
const models = {
    usersModel: require('./nosql/users'),
    clientModel: require('./nosql/client'),
    projectModel: require('./nosql/project'),
 }
 
 module.exports = models