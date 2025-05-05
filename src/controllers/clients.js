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
    
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud
        
        const client = await clientModel.create(data);

        res.status(201).send({ data: client });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_CREATE_CLIENT', 500);
    }
}

async function getClient(req, res) {
    try {
        const { id } = req.params; // ID del cliente a buscar
        const client = await clientModel.findById(id); // Buscar cliente por ID
        
        if (!client) {
            return res.status(404).send('Cliente no encontrado');
        }
        
        res.send({ data: client });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_GET_CLIENT', 500);
    }
}

async function archiveClient(req, res) {
    try {
        const { id } = req.params; // ID del cliente a archivar
        const client = await clientModel.findById(id); // Buscar cliente por ID

        if (!client) {
            return res.status(404).send('Cliente no encontrado');
        }
        const archivedClient = await clientModel.findByIdAndUpdate(id, { deleted: true }, { new: true }); // Archivar cliente
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
        const { id } = req.params; // ID del cliente a eliminar
        const client = await clientModel.findById(id); // Buscar cliente por ID
        
        if (!client) {
            return res.status(404).send('Cliente no encontrado');
        }
        
        await clientModel.findByIdAndDelete(id); // Eliminar cliente
        res.send({ message: 'Cliente eliminado' });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_DELETE_CLIENT', 500);
    }
}

async function restoreClient(req, res) {
    try {
        const { id } = req.params; // ID del cliente a restaurar
        const client = await clientModel.findById(id); // Buscar cliente por ID
        
        if (!client) {
            return res.status(404).send('Cliente no encontrado');
        }
        
        const restoredClient = await clientModel.findByIdAndUpdate(id, { deleted: false }, { new: true }); // Restaurar cliente
        res.send({ data: restoredClient });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_RESTORE_CLIENT', 500);
    }
}

async function updateClient(req, res) {
    try {
        const { id } = req.params; // ID del cliente a actualizar
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud
        
        const client = await clientModel.findByIdAndUpdate(id, data, { new: true }); // Actualizar cliente
        
        if (!client) {
            return res.status(404).send('Cliente no encontrado');
        }
        
        res.send({ data: client });
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_UPDATE_CLIENT', 500);
    }
}


async function getProjectOfClient(req, res) {
    try {
        const { id } = req.params; // ID del cliente a buscar
        const client = await clientModel.findById(id); // Buscar cliente por ID
        
        if (!client) {
            return res.status(404).send('Cliente no encontrado');
        }
        
        const projects = await projectModel.find({ clientId: id }); // Buscar proyectos relacionados al cliente
        
        if (!projects || projects.length === 0) {
            return res.status(400).send('Este cliente no tiene proyectos registrados');
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