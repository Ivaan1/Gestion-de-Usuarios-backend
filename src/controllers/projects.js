
const { projectModel } = require('../models'); // Importar el modelo de proyecto
const { handleHttpError } = require('../utils/handleErrors')
const { matchedData } = require('express-validator')

async function createProject(req, res) {
    try {
        const { id } = req.user; // ID extraído del token 
        
        const data = matchedData(req); 

        const existingProject = await projectModel.findOne({
            projectCode: data.projectCode,  
            userId: id, 
        });

        if (existingProject) {
            return res.status(400).send('Ya existe un proyecto con ese projectCode para este usuario');
        }

        const project = await projectModel.create({
            ...data,
            userId: id, // Asignar el ID del usuario al proyecto
            clientId: data.clientId, // Asignar el ID del cliente al proyecto
        });

        res.status(201).send({ data: project }); // Enviar la respuesta con el proyecto creado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_CREATE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function updateProject(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud

        const { projectCode, userId } = data; // Extraemos projectCode y userId si están en los datos

        // Eliminar projectCode y userId de los datos que se actualizarán
        delete data.projectCode; 
        delete data.userId;      

        // Validación para asegurarse de que no haya otro proyecto con el mismo projectCode para el mismo cliente y usuario
        const existingProject = await projectModel.findOne({
            projectCode: projectCode,
            userId: req.userId, // ID del usuario extraído del token
            _id: { $ne: id }, // Excluir el proyecto actual
        });

        if (existingProject) {
            return res.status(400).send('Ya existe un proyecto con ese projectCode para este usuario y cliente');
        }

        const project = await projectModel.findByIdAndUpdate(id, data, { new: true }); // Actualizar el proyecto en la base de datos

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }

        res.status(200).send({ data: project }); // Enviar la respuesta con el proyecto actualizado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_UPDATE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function getProjects(req, res) {
    try {
        const { id } = req.user; // ID extraído del token 
        
        const projects = await projectModel.find({ userId: id }); // Obtener todos los proyectos relacionados a la cuenta de usuario

        res.status(200).send({ data: projects }); // Enviar la respuesta con los proyectos
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_GET_PROJECTS', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function getProject(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud

        const project = await projectModel.findById(id); // Buscar el proyecto por ID

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }

        res.status(200).send({ data: project }); // Enviar la respuesta con el proyecto encontrado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_GET_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function archiveProject(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud

        const project = await projectModel.findByIdAndUpdate(id, { deleted: true }, { new: true }); // Archivar el proyecto (soft delete)

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }

        res.status(200).send({ data: project }); // Enviar la respuesta con el proyecto archivado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_ARCHIVE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function restoreProject(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud

        const project = await projectModel.findByIdAndUpdate(id, { deleted: false }, { new: true }); // Restaurar el proyecto (soft delete)

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }

        res.status(200).send({ data: project }); // Enviar la respuesta con el proyecto restaurado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_RESTORE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function deleteProject(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud

        const project = await projectModel.findByIdAndDelete(id); // Eliminar el proyecto (hard delete)

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }

        res.send({ message: 'Proyecto eliminado' });
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_DELETE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}


module.exports = {
    createProject,
    updateProject,
    getProjects,
    getProject,
    archiveProject,
    restoreProject,
    deleteProject
};
