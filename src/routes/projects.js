const express = require('express');
const router = express.Router();

const { createProject, updateProject, getProjects, getProject, archiveProject, restoreProject, deleteProject, getProjectOfClient } = require("../controllers/projects")
const { validatorCreateProject, validatorUpdateProject, validatorGetProject } = require('../validators/projects')
const authMiddleWare = require("../middleware/sessions");
const { validateUserMiddleware } = require("../middleware/validated")



router.get("/", authMiddleWare,validateUserMiddleware, getProjects) 

router.post("/", authMiddleWare, validatorCreateProject,validateUserMiddleware, createProject)

router.patch("/archive/:id", authMiddleWare, validatorGetProject,validateUserMiddleware, archiveProject) 

router.patch("/restore/:id", authMiddleWare, validatorGetProject,validateUserMiddleware, restoreProject)

router.get("/:id", authMiddleWare, validatorGetProject,validateUserMiddleware, getProject)

router.put("/:id", authMiddleWare, validatorUpdateProject,validateUserMiddleware, updateProject) 

router.delete("/:id", authMiddleWare, validatorGetProject,validateUserMiddleware, deleteProject) 

module.exports = router;