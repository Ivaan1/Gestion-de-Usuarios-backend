const { albaranModel, projectModel, clientModel }= require('../models'); 
const { handleHttpError } = require('../utils/handleErrors'); 
const { matchedData } = require('express-validator')
const { generateAlbaranPDF, saveAlbaranPDF } = require('../services/pdfGenerator'); 
const { uploadToPinata } = require('../utils/handleUploadIPFS');

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
        
        const albaran = await albaranModel.findById(id)
            .populate('userId', 'name email address') 
            .populate('clientId', 'name address cif') 
            .populate('projectId', 'name projectCode');

        if (!albaran) {
            return handleHttpError(res, 'ALBARAN_NOT_FOUND', 404); // Manejar el error si el albarán no se encuentra
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
    
        // Obtener datos del albarán de la base de datos
        const albaran = await albaranModel.findById(id)
        .populate('userId', 'name email address')
        .populate('clientId', 'name address cif')
        .populate('projectId', 'name projectCode');
    
        if (!albaran) {
            return handleHttpError(res, 'ALBARAN_NOT_FOUND', 404);
        }
        
        // Guardar el PDF en el sistema de archivos (opcional)
        // Si prefieres no guardarlo en disco, puedes omitir esta línea
        await saveAlbaranPDF(albaran);
        
        // Configurar cabeceras para descarga del PDF
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=albaran-${id}.pdf`);
    
        // Generar el PDF directamente al response stream
        await generateAlbaranPDF(albaran, res);
        
      } catch (error) {
        console.log(error); // Imprimir el error en la consola
        handleHttpError(res, 'ERROR_GENERATE_ALBARAN_PDF', 500);
      }
}


async function downloadPDF(req, res) {
    try {
      const { id } = req.params;
      
      // Verificar si el PDF ya existe en el sistema de archivos
      const pdfPath = path.join(__dirname, '../uploads/albaranes', `albaran-${id}.pdf`);
      
      if (fs.existsSync(pdfPath)) {
        // Si el PDF ya existe, enviarlo como descarga
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=albaran-${id}.pdf`);
        return fs.createReadStream(pdfPath).pipe(res);
      }
      
      // Si no existe, obtener datos del albarán
      const albaran = await albaranModel.findById(id)
        .populate('userId', 'name email address')
        .populate('clientId', 'name address cif')
        .populate('projectId', 'name projectCode');
      
      if (!albaran) {
        return handleHttpError(res, 'ALBARAN_NOT_FOUND', 404);
      }
      
      // Configurar cabeceras para descarga del PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=albaran-${id}.pdf`);
      
      // Generar el PDF directamente al response stream
      await generateAlbaranPDF(albaran, res);
      
    } catch (error) {
      console.log(error);
      handleHttpError(res, 'ERROR_DOWNLOAD_ALBARAN_PDF', 500);
    }
  }

  async function uploadSign(req, res) {
      try {
        const { id } = req.params;
        const body = matchedData(req); // Extraer los datos del cuerpo de la solicitud

          if (!req.file) {
              handleHttpError(res, 'NO_FILE_UPLOADED', 400)
          }
  
          const fileBuffer = req.file.buffer;
          const fileName = req.file.originalname;
          const pinataResponse = await uploadToPinata(fileBuffer, fileName);

          if (!pinataResponse || !pinataResponse.IpfsHash) {
            return handleHttpError(res, 'PINATA_UPLOAD_FAILED', 500);
        }
  
        const ipfsFile = pinataResponse.IpfsHash;
        const ipfsUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`;

        // Asignar la URL de la firma al cuerpo
        body.sign = ipfsUrl;

        // Buscar el albarán y actualizarlo con la firma
        const albaran = await albaranModel.findByIdAndUpdate(id, { $set: body }, { new: true });

        // Si no se encuentra el albarán
        if (!albaran) {
            return handleHttpError(res, 'ALBARAN_NOT_FOUND', 404);
        }

        // Responder con el albarán actualizado
        res.status(200).send({ data: albaran });
      } catch (error) {
          console.error(error);
          handleHttpError(res, 'ERROR_UPLOAD_SIGN', 500);
      }
  }

module.exports = {
    createAlbaran,
    getAlbaranes,
    getAlbaran,
    generatePDF,
    downloadPDF,
    uploadSign
    // Aquí puedes agregar más funciones para manejar otras operaciones relacionadas con albaranes
};