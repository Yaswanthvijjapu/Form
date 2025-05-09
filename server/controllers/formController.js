// server/controllers/formController.js
const Form = require('../models/Form');
const { v4: uuidv4 } = require('uuid');
const generateShareLink = require('../utils/generateShareLink');

const createForm = async (req, res, next) => {
  const { title, fields } = req.body;
  try {
    const shareLink = generateShareLink();
    const form = new Form({
      title,
      fields,
      userId: req.user.user.id,
      shareLink,
    });
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    next(error);
  }
};

const getForms = async (req, res, next) => {
  try {
    const forms = await Form.find({ userId: req.user.user.id });
    res.json(forms);
  } catch (error) {
    next(error);
  }
};

const getFormById = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    if (form.userId.toString() !== req.user.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    res.json(form);
  } catch (error) {
    next(error);
  }
};

const getFormByShareLink = async (req, res, next) => {
  try {
    const form = await Form.findOne({ shareLink: req.params.shareLink });
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    next(error);
  }
};

const updateForm = async (req, res, next) => {
  const { title, fields } = req.body;
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    if (form.userId.toString() !== req.user.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    form.title = title || form.title;
    form.fields = fields || form.fields;
    await form.save();
    res.json(form);
  } catch (error) {
    next(error);
  }
};

const deleteForm = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    if (form.userId.toString() !== req.user.user.id) {
      return res.status(403).json({ error: 'Not authorized' });
    }
    await form.deleteOne();
    res.json({ message: 'Form deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createForm, getForms, getFormById, getFormByShareLink, updateForm, deleteForm };