const { usersModel } = require('../models');
const { handleHttpError } = require ('../utils/handleErrors')
const { uploadToPinata } = require('../utils/handleUploadIPFS')
const { matchedData } = require('express-validator')


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


/**
 * Función para eliminar todos los usuarios.
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Respuesta del borrado de la base de datos.
 */
async function deleteAllUsers(req, res) {
    try {
        // Elimina todos los usuarios
        const data = await usersModel.deleteMany({});

        // Verifica si se eliminaron usuarios
        if (data.deletedCount === 0) {
            return res.status(400).send('No se han encontrado usuarios para eliminar');
        }

        res.send('Usuarios eliminados correctamente');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error al eliminar los usuarios');
    }
}

/**
 * Función para añadir la foto del perfil de usuario. Solo la puede cambiar la persona loggeada porque se usa su token con su id.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function uploadImage(req, res) {
    try {
        const { body } = req
        const id = req.user._id

        if (!req.file) {
            handleHttpError(res, 'NO_FILE_UPLOADED', 400)
        }

        const fileBuffer = req.file.buffer;
        const fileName = req.file.originalname;
        const pinataResponse = await uploadToPinata(fileBuffer, fileName);

        const ipfsFile = pinataResponse.IpfsHash;

        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

        body.profilePicture = ipfs;

        const data = await usersModel.findByIdAndUpdate(id, { $set: body }, { new: true });
        
        res.send(data);
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'ERROR_CREATE_USER')
    }
}

async function updateUser(req, res) {
    try {
        const { id, ...body } = matchedData(req)
        const data = await usersModel.findByIdAndUpdate(id, { $set: body }, { new: true })
        res.send(data)
    } catch (error) {
        console.log(error)
        handleHttpError(res, 'ERROR_UPDATE_USER')
    }
}

async function deleteLoggedUser(req, res) {
    try {
        const id = req.user.id
        const data = await usersModel.findByIdAndDelete({ _id: id })
        res.send(data)
    } catch (error) {
        console.log(error)
        handleHttpError(res, 'ERROR_DELETE_YOUR_USER')
    }
}

module.exports = {
    getUsers,
    getUser,
    createUsers,
    deleteUser,
    deleteAllUsers,
    uploadImage,
    updateUser,
    deleteLoggedUser
    // Puedes agregar más funciones según sea necesario
};
