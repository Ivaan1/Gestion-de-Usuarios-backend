const { usersModel, companyModel } = require('../models');
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
        const user = await usersModel.findById(id)
        if (!user) {
            return res.status(400).send('Usuario no encontrado');
        }

        let populatedUser;
        if (user.companyId) {
            populatedUser = await usersModel.findById(id)
                .populate('companyId', 'name address')
                .lean();
        } else {
            populatedUser = user.toObject(); // Convertir a objeto plano
        }

        res.send({ data: populatedUser });
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

// @deprecated
async function updateUserAddress(req, res) {
    try {
        const { id, ...body } = matchedData(req)
        const data = await usersModel.findByIdAndUpdate(id, { $set: body }, { new: true })
        res.send(data)
    } catch (error) {
        console.log(error)
        handleHttpError(res, 'ERROR_UPDATE_ADDRESS_USER')
    }
}

async function getCompany(req, res) {
    try {
        const { id } = req.user; // Obtener el ID del usuario del token

        const usercompany = await companyModel.findOne({ users: id });

        if (!id) {
            return res.status(404).send('Usuario no encontrado'); // Manejar el error si el usuario no se encuentra
        }
        if (!usercompany) {
            return res.status(404).send('Este usuario no esta vinculado con ninguna empresa'); // Manejar el error si la empresa no se encuentra
        }
        
        res.send({ usercompany }); // Enviar la respuesta con la empresa
    } catch (error) {
        console.error(error); // Imprimir el error en la consola
        res.status(500).send('Error al obtener la empresa del usuario'); // Manejar el error y enviar una respuesta al cliente
    }
}

async function addCompany(req, res) {
    try {
        const { id } = req.user; // Obtener el ID del usuario del token
        const data = matchedData(req); // Obtener el cuerpo de la empresa
        const user = await usersModel.findById(id); // Buscar el usuario por ID
        
        if (!user) {
            return res.status(404).send('Usuario no encontrado'); // Manejar el error si el usuario no se encuentra
        }
        if (user.companyId) {
            return res.status(400).send('Este usuario ya tiene una empresa vinculada'); // Manejar el error si el usuario ya tiene una empresa vinculada
        }
        
        const usercompany = await companyModel.create(data);

        // Vincular la empresa al usuario
        user.companyId = usercompany._id; // Asignar el ID de la empresa al campo companyId del usuario

        const companyId = usercompany._id; // Obtener el ID de la empresa creada
        // Vincular el usuario a la empresa
        await companyModel.findByIdAndUpdate(
            companyId, 
            { $push: { users: id } } // userId es el ObjectId del usuario a agregar
          );

        await usercompany.save(); // Guardar la empresa con el usuario vinculado
        await user.save(); // Guardar el usuario con la empresa vinculada

        const updatedCompany = await companyModel.findById(usercompany._id);

        res.status(201).send({ data: updatedCompany }); // Enviar la respuesta con la empresa creada

    } catch (error) {
        console.error(error); // Imprimir el error en la consola
        res.status(500).send('Error al agregar la empresa al usuario'); // Manejar el error y enviar una respuesta al cliente
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
    deleteLoggedUser,
    updateUserAddress,
    getCompany,
    addCompany
    // Puedes agregar más funciones según sea necesario
};
