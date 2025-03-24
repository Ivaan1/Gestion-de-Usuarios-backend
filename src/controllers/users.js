const { usersModel } = require('../models');

/**
 * Función que busca todos los datos dentro de la colección de "Users" en la base de datos de Mongo.
 * Devuelve un array con la lista de todos los usuarios.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Todos los usuarios registrados.
 */
async function getUsers(req, res) {
    try {
        const data = await usersModel.find({});
        res.send(data);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al obtener los usuarios');
    }
}

/**
 * Función para buscar un usuario por id. 
 * Si no se encuentra ese usuario en la base de datos devuelve un error.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Usuario buscado por ID.
 */
async function getUser(req, res) {
    try {
        const id = req.params.id;
        const dato = await usersModel.findById(id);

        if (!dato) {
            return res.status(400).send('Usuario no encontrado');
        }

        res.send({ dato });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el usuario');
    }
}

/**
 * Función para crear un nuevo usuario.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Usuario creado.
 */
async function createUsers(req, res) {
    try {
        const { body } = req;

        const data = await usersModel.create(body);
        res.status(201).send(data);
    } catch (error) {
        console.error('Error creando el usuario:', error);
        res.status(500).send('Error al crear el usuario');
    }
}

/**
 * Función para eliminar un usuario con el id. 
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Respuesta del borrado de la base de datos.
 */
async function deleteUser(req, res) {
    try {
        const { id } = req.params;  // Obtener el id desde la URL

        const data = await usersModel.findByIdAndDelete(id);

        if (!data) {
            return res.status(400).send('Usuario no encontrado');
        }

        res.send('Usuario eliminado');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar el usuario');
    }
}

module.exports = {
    getUsers,
    getUser,
    createUsers,
    deleteUser
};
