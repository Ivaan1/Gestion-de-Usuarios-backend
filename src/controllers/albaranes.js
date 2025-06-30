const { albaranModel, projectModel, clientModel, usersModel }= require('../models'); 
const { handleHttpError } = require('../utils/handleErrors'); 
const { matchedData } = require('express-validator')
const { generateAlbaranPDF, saveAlbaranPDF } = require('../services/pdfGenerator'); 
const { uploadToPinata } = require('../utils/handleUploadIPFS');
const path = require('path');
const fs = require('fs/promises');


  
async function createAlbaran(req, res) {
    try {

        const { id } = req.user; // ID extraído del token 
        const { id : userId } = req.user; // ID del usuario extraído del token
        const data = matchedData(req); // Extraer los datos del cuerpo de la solicitud

        const albaran = await albaranModel.findOne({ albaranCode: data.albaranCode });
        const project = await projectModel.findOne({ _id: data.projectId });

        if (project.userId.toString() !== userId) {
            return handleHttpError(res, 'NOT_AUTHORIZED', 403); // Manejar el error si el usuario no está autorizado
        }

        if (albaran) {
            return handleHttpError(res, 'ALBARAN_ALREADY_EXISTS', 409); 
        }

        // Verificar que el clientId existe
        const client = await clientModel.findById(data.clientId);
        if (!client) {
            return handleHttpError(res, 'CLIENT_NOT_FOUND', 404);
        }

        // Verificar que el projectId existe y pertenece al cliente
        const existingproject = await projectModel.findOne({ 
            _id: data.projectId,
            clientId: data.clientId // Asegurarse de que el projectId pertenezca al clientId
        });

        if (!existingproject) {
            return handleHttpError(res, 'PROJECT_NOT_FOUND', 404); 
        }

        // Asegúrate de que 'material' y 'hours' sean arreglos según el 'format'
        if (data.format === 'material' && !Array.isArray(data.material)) {
            return res.status(400).send({ message: 'El material debe ser un arreglo de cadenas de texto' });
        }

        if (data.format === 'hours' && !Array.isArray(data.hours)) {
            return res.status(400).send({ message: 'Las horas deben ser un arreglo de números' });
        }

        // Si el formato es material, asegúrate de que cada elemento en 'material' sea una cadena
        if (data.format === 'material' && data.material.some(item => typeof item !== 'string')) {
            return res.status(400).send({ message: 'Cada material debe ser una cadena de texto' });
        }

        // Si el formato es hours, asegúrate de que cada valor en 'hours' sea un número
        if (data.format === 'hours' && data.hours.some(item => typeof item !== 'number')) {
            return res.status(400).send({ message: 'Cada hora debe ser un número' });
        }

        
        const newalbaran = await albaranModel.create({
            ...data,
            userId: id, // Asignar el ID del usuario al albarán
            clientId: data.clientId, // Asignar el ID del cliente al albarán
            projectId: data.projectId, // Asignar el ID del proyecto al albarán
        });

        // añadir +1 a activeDeliveryNotes del cliente
        client.activeDeliveryNotes += 1; // Incrementar el contador de albaranes activos
        await client.save(); // Guardar los cambios en el cliente

        res.status(201).send({ data: newalbaran }); // Enviar la respuesta con el albarán creado
    } catch (error) {
        console.error("Error inesperado:", error); // Lo imprimes aquí también para no perderlo
        // handleHttpError(res, 'ERROR_CREATE_ALBARAN', 500);
        next(error);
    }
    
}

/**
    * Obtener todos los albaranes de un USU
 * @param {*} req 
 * @param {*} res 
 * * @returns 
 */
async function getAlbaranes(req, res) {
    try {
        const { id } = req.user; // ID extraído del token 
       
        const albaranes = await albaranModel.find({ userId: id });

        res.status(200).send({ data: albaranes }); // Enviar todos los albaranes del usuario
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_GET_ALBARAN', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function getAlbaran(req, res) {
    try {
        const { id } = req.params; // ID del albarán extraído de los parámetros de la solicitud
        const { id: userId } = req.user; // ID del usuario extraído del token
        
        const albaran = await albaranModel.findById(id)
            .populate('userId', 'email address') 
            .populate('clientId', 'name address cif') 
            .populate('projectId', 'name projectCode');

        if (!albaran) {
            return handleHttpError(res, 'ALBARAN_NOT_FOUND', 404); // Manejar el error si el albarán no se encuentra
        }

        if (albaran.userId._id.toString() !== userId) {
            return handleHttpError(res, 'NOT_AUTHORIZED', 403); // Manejar el error si el usuario no está autorizado
        }

        res.status(200).send({ data: albaran }); // Enviar la respuesta con el albarán encontrado
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_GET_ALBARAN', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function generatePDF(req, res) {
    try {
        const { id } = req.params;
        const { id: userAuthId } = req.user; // ID extraído del token 
    
        // Obtener datos del albarán de la base de datos
        const albaran = await albaranModel.findById(id)
        .populate('userId', 'name email address')
        .populate('clientId', 'name address cif')
        .populate('projectId', 'name projectCode');
    
        if (!albaran) {
            return handleHttpError(res, 'ALBARAN_NOT_FOUND', 404);
        }
        // El usuario solo podra acceder a sus albaranes 
        if (albaran.userId._id.toString() !== userAuthId) {
            return handleHttpError(res, 'UNAUTHORIZED_ACCESS', 403);
        }

        await saveAlbaranPDF(albaran);  // Generar y guardar

        // Actualizar el campo pdfGenerated a true
        albaran.pdfGenerated = true;
        await albaran.save();


        return res.status(200).json({ message: 'PDF generado correctamente' });

      } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_GENERATE_ALBARAN_PDF', 500);
      }
}


async function downloadPDF(req, res) {
    try {
        const { id } = req.params;
      
        const albaran = await albaranModel.findById(id);
      
        if (!albaran) {
            return handleHttpError(res, 'ALBARAN_NOT_FOUND', 404);
        }
        // Verificar si el albarán está firmado
        if (!albaran.signed) {
            return handleHttpError(res, 'ALBARAN_NOT_SIGNED', 400);
        }
        const pdfUrl = albaran.pdfUrl;
        if (!pdfUrl) {
            return handleHttpError(res, 'PDF_NOT_FOUND', 404);
        }

        // Redirigir a la URL de IPFS para la descarga
        res.redirect(pdfUrl);

    } catch (error) {
      console.log(error);
      handleHttpError(res, 'ERROR_DOWNLOAD_ALBARAN_PDF', 500);
    }
  }

  async function uploadSign(req, res) {
      try {
        const { id } = req.params; //ID del albaran 
        const albaran = await albaranModel.findById(id); // Obtener el albarán por ID

        
          if (!req.file) {
              handleHttpError(res, 'NO_FILE_UPLOADED', 400)
          }

            // Subir la firma a IPFS
          const fileBuffer = req.file.buffer;
          const fileName = req.file.originalname;

          ///subir la firma a pinata
          const pinataResponse = await uploadToPinata(fileBuffer, fileName);
          
          if (!pinataResponse || !pinataResponse.IpfsHash) {
            return handleHttpError(res, 'PINATA_UPLOAD_FAILED', 500);
        }
    
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfsUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;
        
        // Asignar la URL de la firma al cuerpo
        albaran.sign = ipfsUrl;
        albaran.signed = true; // Marcar el albarán como firmado

        //accedemos a la ruta del pdf que se guarda en el servidor
        const pdfPath = path.join(__dirname, '../uploads/albaranes', `albaran-${albaran.albaranCode}.pdf`);
        const pdfBuffer = await fs.readFile(pdfPath);

        const pdfFileName = `albaran-${albaran.albaranCode}.pdf`; // El nombre del archivo PDF

       // Subir el PDF a Pinata
       
       const pdfPinataResponse = await uploadToPinata(pdfBuffer, pdfFileName);
        
       if (!pdfPinataResponse || !pdfPinataResponse.IpfsHash) {
           return handleHttpError(res, 'PDF_PINATA_UPLOAD_FAILED', 500);
       }

       const pdfIpfsFile = pdfPinataResponse.IpfsHash;
       const pdfIpfsUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${pdfIpfsFile}`;

       // Actualizar el albarán con la URL del PDF
       albaran.pdfUrl = pdfIpfsUrl;
       
       // Actualizar el albarán en la base de datos
       await albaran.save();

       // Responder con el albarán actualizado
       res.status(200).send({ data: albaran });

       await fs.unlink(pdfPath); // Eliminar el PDF localmente después de subirlo a IPFS

      } catch (error) {
          console.error(error);
          handleHttpError(res, 'ERROR_UPLOAD_SIGN', 500);
      }
  }

  async function deleteAlbaran(req, res) {
    try {
        const { id } = req.params; // ID del albarán a eliminar
        const { id: userId } = req.user; // ID del usuario extraído del token
        const albaran = await albaranModel.findById(id); // Buscar albarán por ID
        if (!albaran) {
            return res.status(404).send('Albarán no encontrado');
        }   
        if (albaran.userId.toString() !== userId) {
            return res.status(403).send('No tienes permiso para eliminar este albarán');
        }
        if (albaran.signed) {
            return res.status(400).send('No se puede eliminar un albarán firmado');
        }
        await albaranModel.findByIdAndDelete(id); // Eliminar albarán
        res.send({ message: 'Albarán eliminado' });
    }
    catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_DELETE_ALBARAN', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

async function getAlbaranesByProject(req, res) {
    try {
        const { id: projectId } = req.params; // ID del proyecto extraído de los parámetros de la solicitud
        const { id: userId } = req.user; // ID del usuario extraído del token

        const albaranes = await albaranModel.find({ projectId, userId })
            .populate('userId', 'name email address') 
            .populate('clientId', 'name address cif') 
            .populate('projectId', 'name projectCode');

        if (!albaranes) {
            return handleHttpError(res, 'ALBARANES_NOT_FOUND', 404); // Manejar el error si no se encuentran albaranes
        }

        res.status(200).send({ data: albaranes }); // Enviar la respuesta con los albaranes encontrados
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_GET_ALBARANES', 500); // Manejar el error y enviar una respuesta al cliente
    }
}

//SOLO USAR PARA TESTING
//esta funcion elimina todos los albaranes de la base de datos
async function deleteAllAlbaranes(req, res) {
    try {
        await albaranModel.deleteMany({}); // Eliminar todos los albaranes de la base de datos
        res.status(200).send({ message: 'Todos los albaranes han sido eliminados' }); // Enviar respuesta de éxito
    } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_DELETE_ALL_ALBARANES', 500); // Manejar el error y enviar una respuesta al cliente
    }
}


module.exports = {
    createAlbaran,
    getAlbaranes,
    getAlbaran,
    generatePDF,
    downloadPDF,
    uploadSign,
    deleteAlbaran,
    getAlbaranesByProject,
    deleteAllAlbaranes,
    // Aquí puedes agregar más funciones para manejar otras operaciones relacionadas con albaranes
};