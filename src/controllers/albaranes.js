const { albaranModel, projectModel, clientModel }= require('../models'); 
const { handleHttpError } = require('../utils/handleErrors'); 
const { matchedData } = require('express-validator')


async function createAlbaran(req, res) {
    try {
        const { id } = req.user; // ID extraído del token 
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud

        // Verificar que el clientId existe
        const client = await clientModel.findById(data.clientId);
        if (!client) {
            return res.status(400).send({ message: 'El cliente no existe' });
        }

        // Verificar que el projectId existe y pertenece al cliente
        const project = await projectModel.findOne({ 
            _id: data.projectId,
            clientId: data.clientId // Asegurarse de que el projectId pertenezca al clientId
        });

        if (!project) {
            return res.status(400).send({ message: 'El proyecto no existe o no pertenece a este cliente' });
        }

        
        const albaran = await albaranModel.create({
            ...data,
            userId: id, // Asignar el ID del usuario al albarán
            clientId: data.clientId, // Asignar el ID del cliente al albarán
        });

        res.status(201).send({ data: albaran }); // Enviar la respuesta con el albarán creado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_CREATE_ALBARAN', 500); // Manejar el error y enviar una respuesta al cliente
    }
    
}

module.exports = {
    createAlbaran
    // Aquí puedes agregar más funciones para manejar otras operaciones relacionadas con albaranes
};