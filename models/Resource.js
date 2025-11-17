const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  designation: { type: String, required: true },
  allocation_percentage: { type: Number, required: true, min: 0, max: 100 }
});

module.exports = mongoose.model('Resource', resourceSchema);