const { model, Schema } = require('mongoose');

const startupSchema = new Schema({
  name: String,
  createdAt: Date,
  isCompleted: Boolean,
  phases: [{ type: Schema.Types.ObjectId, ref: 'Phase' }],
});

module.exports = model('Startup', startupSchema)