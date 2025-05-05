const express = require('express');
const router = express.Router();

const { createProject, updateProject, getProjects } = require("../controllers/projects")
const { validatorCreateProject, validatorUpdateProject } = require('../validators/projects')
const authMiddleWare = require("../middleware/sessions")

router.get("/", authMiddleWare, getProjects) 
router.post("/", authMiddleWare, validatorCreateProject, createProject)
router.put("/:id", authMiddleWare, validatorUpdateProject, updateProject) 

module.exports = router;