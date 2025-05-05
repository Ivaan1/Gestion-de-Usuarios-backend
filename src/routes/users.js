const express = require("express");
const router = express.Router();

// Controladores para manejar las rutas
const { getUsers, getUser, createUsers, deleteUser, deleteAllUsers, uploadImage, updateUser, updateUserAddress } = require("../controllers/users");
const { validatorGetUser, validatorCreateUser, validatorUpdateUser } = require('../validators/users')
const authMiddleWare = require("../middleware/sessions")
const { uploadMiddlewareMemory } = require("../utils/handleStorage")


//GETS
/**
 * @openapi
 * /api/users:
 *   get:
 *     tags:
 *       - Users
 *     summary: "Get all users"
 *     description: Retrieve a list of all users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/user'
 *       '401':
 *         description: Unauthorized, token required
 *       '500':
 *         description: Server error
 */
router.get("/", authMiddleWare, getUsers);


/**
 * @openapi
 * /api/users/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: "Get a user by ID"
 *     description: Retrieve a user by their unique ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       '401':
 *         description: Unauthorized, token required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.get("/:id", authMiddleWare, validatorGetUser, getUser)


//POSTS
/**
 * @openapi
 * /api/users:
 *   post:
 *     tags:
 *       - Users
 *     summary: "Create a new user"
 *     description: Register a new user in the system
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/user'
 *     responses:
 *       '201':
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       '400':
 *         description: Invalid input data
 *       '500':
 *         description: Server error
 */
router.post("/", validatorCreateUser, createUsers)

//DELETE
/**
 * @openapi
 * /api/users/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: "Delete a user by ID"
 *     description: Remove a user from the system by their unique ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '401':
 *         description: Unauthorized, token required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.delete("/:id", authMiddleWare, validatorGetUser, deleteUser)

/**
 * @openapi
 * /api/users:
 *   delete:
 *     tags:
 *       - Users
 *     summary: "Delete all users"
 *     description: Remove all users from the system (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: All users deleted successfully
 *       '401':
 *         description: Unauthorized, token required or insufficient permissions
 *       '500':
 *         description: Server error
 */
router.delete("/",authMiddleWare, deleteAllUsers)


/**
 * @openapi
 * /api/users/image:
 *   patch:
 *     tags:
 *       - Users
 *     summary: "Upload user profile image"
 *     description: Upload a profile image for the authenticated user
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: User profile image (JPG, PNG)
 *     responses:
 *       '200':
 *         description: Image uploaded successfully
 *       '400':
 *         description: Invalid file format or size
 *       '401':
 *         description: Unauthorized, token required
 *       '500':
 *         description: Server error
 */
router.patch("/image", authMiddleWare, uploadMiddlewareMemory.single("image"), uploadImage)

/**
 * @openapi
 * /api/users/{id}:
 *   patch:
 *     tags:
 *       - Users
 *     summary: "Update user information"
 *     description: Update specific fields of a user's profile
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User name
 *               about:
 *                 type: string
 *                 description: User description
 *               phone:
 *                 type: string
 *                 description: Phone number
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       '400':
 *         description: Invalid input data
 *       '401':
 *         description: Unauthorized, token required
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Server error
 */
router.patch("/:id", authMiddleWare, validatorGetUser, validatorUpdateUser, updateUser)


router.patch("/address", authMiddleWare, updateUserAddress)


module.exports = router;
