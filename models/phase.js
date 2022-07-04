const { model, Schema } = require('mongoose');

const phaseSchema = new Schema({
  name: String,
  isCompleted: Boolean,
  tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  startup: { type: Schema.Types.ObjectId, ref: 'Startup' }
});

module.exports = model('Phase', phaseSchema)