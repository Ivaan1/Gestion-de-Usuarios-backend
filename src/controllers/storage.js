const { uploadToPinata } = require('../utils/handleIPFSPinata')

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
module.exports = {
    updateImage
}