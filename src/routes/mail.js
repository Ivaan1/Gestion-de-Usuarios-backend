const express = require("express")
const { validatorMail } = require("../validators/mail")
const { send } = require("../controllers/mail")
const router = express.Router()


/**
 * @openapi
 * /api/mail:
 *   post:
 *     tags:
 *       - Mail
 *     summary: "Send an email"
 *     description: "Send an email with the provided information."
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               to:
 *                 type: string
 *                 description: "Recipient email address"
 *                 example: "recipient@example.com"
 *               subject:
 *                 type: string
 *                 description: "Subject of the email"
 *                 example: "Hello!"
 *               message:
 *                 type: string
 *                 description: "Content of the email"
 *                 example: "This is the body of the email."
 *     responses:
 *       '200':
 *         description: "Email sent successfully"
 *       '400':
 *         description: "Invalid input"
 *       '500':
 *         description: "Server error"
 */
router.post("/mail", validatorMail, send)

module.exports = router