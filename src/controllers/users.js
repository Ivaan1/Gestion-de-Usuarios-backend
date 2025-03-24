const { usersModel } = require('../models')
const { uploadToPinata } = require('../utils/handleUploadIPFS')

const { matchedData } = require('express-validator')
const { handleHttpError } = require('../utils/handleErrors')
const users = require('../models/nosql/users')

/**
 * Función que busca todos los datos dentro de la coleción de "Users" en la base de datos de mongo.
 * Devuelve un array con la lista de todos los usuarios.
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns Todos los usuarios registrados.
 */
async function getUsers(req, res) {
    try {
        const data = await usersModel.find({})
        res.send(data)
    } catch (error) {
        console.log(error)
        handleHttpError(res, 'ERROR_GET_USERS')
    }
}

/**
 * Funión que devuelve toda la información accesible del usuario que ha iniciado sesión. Se usa su token para coger el id de mongo.
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns El usuario loggeado
 */
async function getLoggedUser(req, res) {
    try {
        res.send(req.user)
    } catch (error) {
        console.log(error)
        handleHttpError(res, 'ERROR_GET_USER')
    }
}

/**
 * Función para buscar un usuario por id. 
 * Si no se encuentra ese usuario en la base de datos devuelve un error
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns Usuario buscado por ID.
 */

async function getUser(req, res) {
    try {
        const id = req.params.id;
        const dato = await usersModel.findById(id);

        if (!dato) {
            handleHttpError(res, 'USER_NOT_FOUND', 400)
        }

        res.send({ dato });
    } catch (error) {
        console.error(error);
        handleHttpError(res, 'ERROR_GET_USER')
    }
}

/**
 * @deprecated Por que esto lo hace el register. Cuando se acuerde con el equipo: eliminar
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function createUsers(req, res) {
    try {
        const { body } = req;

        const data = await usersModel.create(body);
        res.send(data);
    } catch (error) {
        console.error('Error creating item:', error);
        handleHttpError(res, 'ERROR_CREATE_USER')
    }
};

/**
 * Función para añadir la foto del perfil de usuario. Solo la puede cambiar la persona loggeada porque se usa su token con su id.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function uploadPhoto(req, res) {
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

/**
 * Función para actualizar la foto de perfil
 * @param {*} req 
 * @param {*} res 
 */
async function updateImage(req, res){
    try {
        const id = req.user.id
        //TODO: esto hay que cogerlo de matchedData -> Preguntar a Profesor por cómo hacer un validador para esto
        const fileBuffer = req.file.buffer
        const fileName = req.file.originalname

        const pinataResponse = await uploadToPinata(fileBuffer, fileName)
        const ipfsFile = pinataResponse.IpfsHash

        const ipfs = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

        const data = await usersModel.findOneAndUpdate({_id: id}, {$set: {profilePicture: ipfs}}, {new: true})

        res.send(data)


    } catch (error) {
        console.log(error)
        handleHttpError(res, 'ERROR_UPDATE_IMAGE')
    }
}

/**
 * Función para actualizar los campos del usuario. Se puede hacer con una función path o put porque la consulta de mongo acepta los dos con el $set.
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns El objeto actualizado
 */
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


/**
 * Función para eliminar un usuario con el id. No se usa para eliminar al mismo usuario que está loggado.
 * 
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns Respueta del borrado de la base de datos.
 */
async function deleteUser(req, res) {
    try {
        const { id } = matchedData(req)
        const data = await usersModel.findByIdAndDelete({ _id: id })
        res.send(data)
    } catch (error) {
        console.log(error)
        handleHttpError(res, 'ERROR_DELETE_USER')
    }
}

/**
 * Función para eliminar el mimso usuario que está loggado.
 * @param {*} req 
 * @param {*} res 
 * 
 * @returns Respuesta del borrado de la base de datos.
 */
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
    getLoggedUser,
    uploadPhoto,
    createUsers,
    updateUser,
    deleteUser,
    deleteLoggedUser
};