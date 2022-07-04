const { model, Schema } = require('mongoose');

const taskSchema = new Schema({
  name: String,
  isCompleted: Boolean,
  phase: { type: Schema.Types.ObjectId, ref: 'Phase' }
});

module.exports = model('Task', taskSchema)