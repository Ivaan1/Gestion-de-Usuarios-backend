const { sendEmail } = require('../utils/handleEmail')
const { handleHttpError } = require('../utils/handleErrors')
const { matchedData } = require('express-validator')

async function send(req, res) {
    try {
        const info = matchedData(req)
        const data = await sendEmail(info)
        res.send(data)
    } catch (err) {
        //console.log(err)
        handleHttpError(res, 'ERROR_SEND_EMAIL')
    }
}

module.exports = { send }