const express = require('express');
const router = express.Router();

const { createProject, updateProject, getProjects, getProject, archiveProject, restoreProject, deleteProject, getProjectOfClient } = require("../controllers/projects")
const { validatorCreateProject, validatorUpdateProject, validatorGetProject } = require('../validators/projects')
const authMiddleWare = require("../middleware/sessions");
const { validatorGetClient } = require('../validators/clients');

router.get("/", authMiddleWare, getProjects) 

router.post("/", authMiddleWare, validatorCreateProject, createProject)

router.patch("/archive/:id", authMiddleWare, validatorGetProject, archiveProject) 

router.patch("/restore/:id", authMiddleWare, validatorGetProject, restoreProject)

router.get("/:id", authMiddleWare, validatorGetProject, getProject)

router.put("/:id", authMiddleWare, validatorUpdateProject, updateProject) 

router.delete("/:id", authMiddleWare, validatorGetProject, deleteProject) 

module.exports = router;