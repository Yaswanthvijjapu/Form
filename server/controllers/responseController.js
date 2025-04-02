// src/controllers/responseController.js
const Form = require('../models/Form');
const Response = require('../models/Response');
const { Parser } = require('json2csv');

const submitResponse = async (req, res, next) => {
  const { answers } = req.body;
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    const response = new Response({
      formId: req.params.formId,
      answers,
    });
    await response.save();
    res.status(201).json(response);
  } catch (error) {
    next(error);
  }
};

// src/controllers/responseController.js
const getResponses = async (req, res, next) => {
    try {
      const form = await Form.findById(req.params.formId);
      if (!form) {
        return res.status(404).json({ error: 'Form not found' });
      }
      const responses = await Response.find({ formId: req.params.formId });
      res.json(responses);
    } catch (error) {
      next(error);
    }
  };

const exportResponses = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    const responses = await Response.find({ formId: req.params.formId });
    const fields = form.fields.map((field, index) => ({
      label: field.label,
      value: `answers.${index}.value`,
    }));
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(responses);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${form.title}_responses.csv`);
    res.send(csv);
  } catch (error) {
    next(error);
  }
};

module.exports = { submitResponse, getResponses, exportResponses };