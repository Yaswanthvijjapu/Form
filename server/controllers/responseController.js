// server/controllers/responseController.js
const Form = require('../models/Form');
const Response = require('../models/Response');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');
const fs = require('fs');

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

    const responses = await Response.find({ formId: req.params.formId }).lean();
    if (!responses || responses.length === 0) {
      return res.status(404).json({ error: 'No responses found for this form' });
    }

    // Collect all unique field IDs across all responses
    const allFieldIds = new Set();
    responses.forEach((response) => {
      response.answers.forEach((answer) => allFieldIds.add(answer.fieldId));
    });

    // Flatten the answers array for CSV
    const flattenedData = responses.map((response) => {
      const row = { submittedAt: new Date(response.submittedAt).toISOString() };
      allFieldIds.forEach((fieldId) => {
        const answer = response.answers.find((a) => a.fieldId === fieldId);
        row[fieldId] = answer
          ? Array.isArray(answer.value)
            ? answer.value.join(', ')
            : answer.value
          : '';
      });
      return row;
    });

    // Define CSV fields
    const fields = ['submittedAt', ...allFieldIds];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(flattenedData);

    // Send the CSV as a downloadable file
    res.header('Content-Type', 'text/csv');
    res.attachment(`${form.title}_responses.csv`);
    res.send(csv);
  } catch (error) {
    console.error('Export responses error:', error);
    next(error);
  }
};

const exportResponsesPdf = async (req, res, next) => {
  try {
    const form = await Form.findById(req.params.formId);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    const responses = await Response.find({ formId: req.params.formId }).lean();
    if (!responses || responses.length === 0) {
      return res.status(404).json({ error: 'No responses found for this form' });
    }

    // Create a new PDF document
    const doc = new PDFDocument();
    res.setHeader('Content-Disposition', `attachment; filename="form_${form.title}_responses.pdf"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Add title
    doc.fontSize(20).text(`Responses for ${form.title}`, { align: 'center' }).moveDown(1);

    // Add table header
    const allFieldIds = new Set();
    responses.forEach((response) => response.answers.forEach((answer) => allFieldIds.add(answer.fieldId)));
    const fields = ['Submitted At', ...allFieldIds];
    doc.fontSize(12).text(fields.join(', '), { align: 'left' }).moveDown(0.5);

    // Add responses
    responses.forEach((response) => {
      const row = [
        new Date(response.submittedAt).toLocaleString(),
        ...Array.from(allFieldIds).map((fieldId) =>
          response.answers.find((a) => a.fieldId === fieldId)?.value || ''
        ),
      ];
      doc.text(row.join(', '), { align: 'left' }).moveDown(0.5);
    });

    // Finalize the PDF
    doc.end();
  } catch (error) {
    console.error('Export PDF error:', error);
    next(error);
  }
};

module.exports = { submitResponse, getResponses, exportResponses , exportResponsesPdf };