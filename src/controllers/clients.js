const { clientModel, projectModel } = require('../models'); 
const { handleHttpError } = require('../utils/handleErrors')
const { matchedData } = require('express-validator')


/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @returns Clientes registrados relacionados a la cuenta de usuario.
 */
async function getClients(req, res) {
    try {
        const { id } = req.user; // ID extraído del token 
        
        const data = await clientModel.find({ userId: id }); // Buscar clientes por userId
        
        if (!data || data.length === 0) {
            return res.status(400).send('Este usuario no tiene clientes registrados');
        }
        res.send(data); 
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_GET_CLIENTS', 500);
    }
}


async function createClient(req, res) {
    try {
        const { id } = req.user; // ID extraído del token
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud

        const existingClient = await clientModel.findOne({  cif: data.cif }); // Buscar cliente por CIF

        if (existingClient) {
            return handleHttpError(res, 'CLIENT_ALREADY_EXISTS', 409); // 409: Conflict
        }

        const client = await clientModel.create({
            ...data,
            userId: id, // Asignar el ID del usuario que creo al cliente
        });
    
        res.status(201).send({ data: client });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_CREATE_CLIENT', 500);
    }
}

async function getClient(req, res) {
    try {
        const { id: userId } = req.user; // ID extraído del token
        const { id: clientId } = req.params; // ID del cliente a buscar

        const client = await clientModel.findOne({ _id: clientId, userId: userId }); // Buscar cliente por ID
        
        if (!client) {
           return handleHttpError(res, 'ERROR_CLIENT_NOT_EXIST', 404);
        }

        if (client.userId.toString() !== userId) {
            return handleHttpError(res, 'ERROR_NO_PERMISOS', 403);
        }
        
        res.send({ data: client });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_GET_CLIENT', 500);
    }
}

async function archiveClient(req, res) {
    try {
        const { id: userId } = req.user; // ID extraído del token
        const { id: clientId } = req.params; // ID del cliente a buscar
        const client = await clientModel.findOne({ _id: clientId, userId }); // Buscar cliente por ID
        
        if (!client) {
           return handleHttpError(res, 'ERROR_CLIENT_NOT_EXIST', 404);
        }

        if (client.userId.toString() !== userId) {
            return handleHttpError(res, 'ERROR_NO_PERMISOS', 403);
        }

        const archivedClient = await clientModel.findByIdAndUpdate(clientId, { deleted: true }, { new: true }); // Archivar cliente
        res.send({ data: archivedClient });
    }
    catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_ARCHIVE_CLIENT', 500);
    }
}

async function getArchivedClients(req, res) {
    try {
        const { id } = req.user; // ID extraído del token 
        
        const data = await clientModel.find({ userId: id, deleted: true }); // Buscar clientes por userId y que estén archivados
        
        if (!data || data.length === 0) {
            return res.status(400).send('Este usuario no tiene clientes archivados');
        }

        
        res.send(data); 
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_GET_ARCHIVED_CLIENTS', 500);
    }
}

async function deleteClient(req, res) {
    try {
        const { id: userId } = req.user; // ID extraído del token
        const { id: clientId } = req.params; // ID del cliente a buscar

        const client = await clientModel.findOne({ _id: clientId, userId }); // Buscar cliente por ID
        
        if (!client) {
            return handleHttpError(res, 'ERROR_CLIENT_NOT_EXIST', 404);
        }

        if (client.userId.toString() !== userId) {
            return handleHttpError(res, 'ERROR_NO_PERMISOS', 403);
        }
        
        await clientModel.findByIdAndDelete(clientId); // Eliminar cliente
        
        res.status(200).json({ acknowledged: true, message: 'Cliente eliminado' });

    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_DELETE_CLIENT', 500);
    }
}

async function restoreClient(req, res) {
    try {
        const { id: userId } = req.user; // ID extraído del token
        const { id: clientId } = req.params; // ID del cliente a buscar
        const client = await clientModel.findOne({ _id: clientId, userId }); // Buscar cliente por ID
    
        
        if (!client) {
            return handleHttpError(res, 'ERROR_CLIENT_NOT_EXIST', 404);
        }

        if (client.userId.toString() !== userId) {
            return handleHttpError(res, 'ERROR_NO_PERMISOS', 403);
        }
        
        const restoredClient = await clientModel.findByIdAndUpdate(clientId, { deleted: false }, { new: true }); // Restaurar cliente 
        res.send({ data: restoredClient });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_RESTORE_CLIENT', 500);
    }
}

async function updateClient(req, res) {
    try {
        const { id : userId } = req.user; //ID del usuario loggeado,
        const { id : clientId} = req.params; // ID del cliente a actualizar
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud
        
        const client = await clientModel.findOneAndUpdate(
            { _id: clientId, userId },  // Asegúrate de que el cliente sea del usuario
            data,                  
            { new: true }          
        );

        if (client.userId.toString() !== userId) {
            return handleHttpError(res, 'ERROR_NO_PERMISOS', 403);
        }

        if (!client) {
            return handleHttpError(res, 'ERROR_CLIENT_NOT_EXIST', 404);
        }

        res.send({ data: client });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_UPDATE_CLIENT', 500);
    }
}


async function getProjectOfClient(req, res) {
    try {
        const { userId } = req.user; // ID extraído del token
        const { id } = req.params; // ID del cliente a buscar
        const projects = await projectModel.find({ clientId: id }); // Buscar proyectos relacionados al cliente
        
        const client = await clientModel.findOne({ _id: id, userId }); // Buscar cliente por ID
        
        if (!client) {
            return handleHttpError(res, 'ERROR_CLIENT_NOT_EXIST', 404);
        }
        
        if (!projects || projects.length === 0) {
            return handleHttpError(res, 'ERROR_NO_PROJECTS', 404);
        }

        if( client.userId !== userId) {
            return handleHttpError(res, 'ERROR_NO_PERMISOS', 403);
        }
        
        res.send({ data: projects });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_GET_PROJECTS_OF_CLIENT', 500);
    }
}


module.exports = { 
    getClients,
    createClient,
    getClient,
    archiveClient,
    getArchivedClients,
    deleteClient,
    restoreClient,
    updateClient,
    getProjectOfClient
}