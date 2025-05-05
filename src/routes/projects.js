const express = require('express');
const router = express.Router();

const { createProject, updateProject, getProjects, getProject, archiveProject, restoreProject, deleteProject } = require("../controllers/projects")
const { validatorCreateProject, validatorUpdateProject, validatorGetProject } = require('../validators/projects')
const authMiddleWare = require("../middleware/sessions")

router.get("/", authMiddleWare, getProjects) 

router.post("/", authMiddleWare, validatorCreateProject, createProject)

router.patch("/archive/:id", authMiddleWare, validatorGetProject, archiveProject) 

router.patch("/restore/:id", authMiddleWare, validatorGetProject, restoreProject)

router.get("/:id", authMiddleWare, validatorGetProject, getProject)

router.put("/:id", authMiddleWare, validatorUpdateProject, updateProject) 

router.delete("/:id", authMiddleWare, validatorGetProject, deleteProject) // Eliminar un proyecto (soft delete)

module.exports = router;