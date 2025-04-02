const mongoose = require('mongoose');

const responseSchema = new mongoose.Schema({
  formId: { type: mongoose.Schema.Types.ObjectId, ref: 'Form', required: true },
  answers: [
    {
      fieldId: { type: String, required: true }, // Maps to field in Form
      value: { type: mongoose.Schema.Types.Mixed }, // Can be string, array, etc.
    },
  ],
  submittedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Response', responseSchema);