
const { projectModel } = require('../models'); // Importar el modelo de proyecto
const { handleHttpError } = require('../utils/handleErrors')
const { matchedData } = require('express-validator')

async function createProject(req, res) {
    try {
        const { id } = req.user; // ID extraído del token 
        
        const data = matchedData(req); 

        const existingProject = await projectModel.findOne({
            projectCode: data.projectCode
        });

        if (existingProject) {
            return handleHttpError(res, 'PROJECT_ALREADY_EXISTS', 409);
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
        const { id: userid } = req.user; // ID extraído del token
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud

        const project = await projectModel.findOne({ _id: id });

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }
        
        if( project.userId.toString() !== userid) {
            return handleHttpError(res, 'NOT_AUTHORIZED', 403); // Manejar el error si el usuario no está autorizado
        }

        const { projectCode, userId  } = data; // Extraer el código del proyecto de los datos por si intentan cambiarlo

        const existingProject = await projectModel.findOne({ projectCode });

        if (existingProject) {
            return handleHttpError(res, 'PROJECT_ALREADY_EXISTS', 409); // Manejar el error si el proyecto ya existe
        }

        const updatedProject = await projectModel.findByIdAndUpdate(
            id,
            { ...data }, // Actualizar el proyecto con los nuevos datos
            { new: true } // Devolver el proyecto actualizado
        );

        res.status(200).send({ data: updatedProject }); // Enviar la respuesta con el proyecto actualizado
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
        const { id: userId } = req.user; // ID extraído del token

        const project = await projectModel.findById(id); // Buscar el proyecto por ID

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }

        if( project.userId.toString() !== userId) {
            return handleHttpError(res, 'NOT_AUTHORIZED', 403); // Manejar el error si el usuario no está autorizado
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
        const { id: userId } = req.user; // ID extraído del token

        const project = await projectModel.findById(id); // Buscar el proyecto por ID

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }
        if( project.userId.toString() !== userId) {
            return handleHttpError(res, 'NOT_AUTHORIZED', 403); // Manejar el error si el usuario no está autorizado
        }
        const archivedProject = await projectModel.findByIdAndUpdate(
            id,
            { deleted: true }, // Marcar el proyecto como archivado (soft delete)
            { new: true } // Devolver el proyecto actualizado
        ).select('name client deleted');
    

        res.status(200).send({ data: archivedProject }); // Enviar la respuesta con el proyecto archivado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_ARCHIVE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function restoreProject(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
        const { id: userId } = req.user; // ID extraído del token

        const project = await projectModel.findById(id); // Buscar el proyecto por ID

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }
        if( project.userId.toString() !== userId) {
            return handleHttpError(res, 'NOT_AUTHORIZED', 403); // Manejar el error si el usuario no está autorizado
        }
        const archivedProject = await projectModel.findByIdAndUpdate(
            id,
            { deleted: false }, // Marcar el proyecto como archivado (soft delete)
            { new: true } // Devolver el proyecto actualizado
        ).select('name client deleted');
    

        res.status(200).send({ data: archivedProject }); // Enviar la respuesta con el proyecto archivado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_ARCHIVE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function deleteProject(req, res) {
    try {
        const { id } = req.params; // Obtener el ID del proyecto de los parámetros de la solicitud
        const { id: userId } = req.user; // ID extraído del token

        const project = await projectModel.findById(id); // Buscar el proyecto por ID

        if (!project) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); // Manejar el error si el proyecto no se encuentra
        }
        if( project.userId.toString() !== userId) {
            return handleHttpError(res, 'NOT_AUTHORIZED', 403); // Manejar el error si el usuario no está autorizado
        }

        await projectModel.findByIdAndDelete(id); // Eliminar el proyecto de la base de datos
        res.send({ message: 'Proyecto eliminado' });
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_DELETE_PROJECT', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function deleteAllProjects(req, res) {
    try {
        await projectModel.deleteMany({ }); 
        res.send({ message: 'Todos los proyectos eliminados' }); 
    } catch (error) {
        console.log(error);
        handleHttpError(res, 'ERROR_DELETE_ALL_PROJECTS', 500); 
    }
}


module.exports = {
    createProject,
    updateProject,
    getProjects,
    getProject,
    archiveProject,
    restoreProject,
    deleteProject,
    deleteAllProjects,
};
