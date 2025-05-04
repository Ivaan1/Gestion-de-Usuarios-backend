const { clientModel } = require('../models'); 
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
        console.log(id)
        const data = await clientModel.find({ userId: id }); // Buscar clientes por userId
        console.log(data)
        
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


module.exports = { 
    getClients,
    createClient,
    // getClient,
    // updateClient,
    // deleteClient,
    // getClients,
    // getClientById
}