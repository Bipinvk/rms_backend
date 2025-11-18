const express = require('express');
const { verifyToken, authorizeRole } = require('../middleware/auth');
const User = require('../models/User');
const Project = require('../models/Project');
const Resource = require('../models/Resource');
const router = express.Router();
const handleUpload = require('../middleware/upload');
router.use(verifyToken);
router.use(authorizeRole(['admin']));

// Users CRUD
router.get('/users', async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');
  res.json(users);
});

router.post('/user', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json(user);
});

router.put('/user/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  res.json(user);
});

router.delete('/user/:id', async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Deleted' });
});

// Projects CRUD
router.get('/projects', async (req, res) => {
  const projects = await Project.find();
  res.json(projects);
});

router.post('/project', async (req, res) => {
  const project = new Project(req.body);
  await project.save();
  res.status(201).json(project);
});

router.put('/project/:id', async (req, res) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(project);
});

router.post('/project/:id/resource', async (req, res) => {
  const { user_id, designation, allocation_percentage } = req.body;
  const resource = new Resource({ user_id, project_id: req.params.id, designation, allocation_percentage });
  await resource.save();
  res.status(201).json(resource);
});

router.get('/project/:id/resources', async (req, res) => {
  const resources = await Resource.find({ project_id: req.params.id }).populate('user_id', 'name email');
  res.json(resources);
});

// After PUT /api/admin/project/:id
// router.put('/project/:id/documents', handleUpload, async (req, res) => {
//   const project = await Project.findByIdAndUpdate(
//     req.params.id,
//     { $push: { documents: req.fileUrl } },
//     { new: true }
//   );
//   res.json(project);
// });

module.exports = router;