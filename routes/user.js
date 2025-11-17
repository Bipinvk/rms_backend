const express = require('express');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const router = express.Router();

router.use(verifyToken);
router.use(authorizeRole(['user']));

router.get('/projects', async (req, res) => {
  const resources = await Resource.find({ user_id: req.user.user_id }).populate('project_id');
  const projects = resources.map(r => r.project_id);
  res.json(projects);
});

router.get('/project/:id', async (req, res) => {
  const project = await Project.findById(req.params.id);
  res.json(project);
});

router.get('/project/:id/summary', async (req, res) => {
  const resources = await Resource.find({ project_id: req.params.id, user_id: req.user.user_id });
  const totalAlloc = resources.reduce((sum, r) => sum + r.allocation_percentage, 0);
  const project = await Project.findById(req.params.id);
  const duration = (new Date(project.end_date) - new Date(project.start_date)) / (1000 * 60 * 60 * 24);
  const availability = 100 - totalAlloc;
  res.json({ totalAlloc, availability, duration: Math.round(duration) });
});

module.exports = router;