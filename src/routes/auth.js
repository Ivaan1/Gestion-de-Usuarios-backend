const express = require("express")
const { validatorRegister, validatorLogin, validatorNewPassword, validatorValidation, validatorRecoverPassword } = require("../validators/auth")
const { registerUser, loginUser, updatePassword, recoverPassword, validateUser } = require('../controllers/auth')
const router = express.Router()
const authMiddleWare = require("../middleware/sessions")

/**
 * @openapi
 * /api/auth/register:
 *   post:
 *     tags:
 *       - User
 *     summary: "User register"
 *     description: Register a new user
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/user"
 *     responses:
 *       '200':
 *         description: Returns the inserted object
 *       '400':
 *         description: Validation error (client-side)
 *       '500':
 *         description: Server error
 */
router.post("/register", validatorRegister, registerUser)

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     tags:
 *       - User
 *     summary: "User login"
 *     description: Login a user and get authentication token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/login"
 *     responses:
 *       '200':
 *         description: Returns user data and token
 *       '401':
 *         description: Invalid credentials
 *       '500':
 *         description: Server error
 */
router.post("/login", validatorLogin, loginUser)

/**
 * @openapi
 * /api/auth/recovery:
 *   post:
 *     tags:
 *       - User
 *     summary: "Password recovery"
 *     description: Request a password recovery for a user account
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["email"]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ejemplo@gmail.com"
 *     responses:
 *       '200':
 *         description: Recovery email sent successfully
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.post("/recovery", validatorRecoverPassword, recoverPassword)

/**
 * @openapi
 * /api/auth/validation:
 *   post:
 *     tags:
 *       - User
 *     summary: "Validate user"
 *     description: Validate a user account
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               validationCode:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       '200':
 *         description: User validated successfully
 *       '400':
 *         description: Invalid validation code
 *       '500':
 *         description: Server error
 *     security:
 *       - bearerAuth: []
 */
router.post("/validation", authMiddleWare,validatorValidation, validateUser)

/**
 * @openapi
 * /api/auth/newpassword:
 *   patch:
 *     tags:
 *       - User
 *     summary: "Update password"
 *     description: Update user password after recovery
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ["email", "password", "newPassword"]
 *             properties:
 *               email:
 *                 type: string
 *                 example: "ejemplo@gmail.com"
 *               password:
 *                 type: string
 *                 description: "Recovery code or old password"
 *               newPassword:
 *                 type: string
 *                 description: "New password (must be at least 8 characters)"
 *     responses:
 *       '200':
 *         description: Password updated successfully
 *       '400':
 *         description: Invalid request data
 *       '401':
 *         description: Invalid recovery code or password
 *       '500':
 *         description: Server error
 */
router.patch("/newpassword", validatorRecoverPassword, validatorNewPassword, updatePassword)

module.exports = router