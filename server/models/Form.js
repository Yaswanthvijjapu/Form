const mongoose = require('mongoose');

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  fields: [
    {
      type: { type: String, required: true }, // e.g., text, checkbox, dropdown
      label: { type: String, required: true },
      options: [{ type: String }], // For dropdowns, checkboxes, etc.
      required: { type: Boolean, default: false },
    },
  ],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  shareLink: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Form', formSchema);
