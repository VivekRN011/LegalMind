const documentService = require('../services/document.service');

const uploadDocument = async (req, res, next) => {
  try {
    console.log('Upload request received');
    console.log('req.file:', req.file);
    console.log('req.user:', req.user);
    
    if (!req.file) {
      console.log('No file in request');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('File mimetype:', req.file.mimetype);
    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({ error: 'Only PDF files are allowed' });
    }

    const result = await documentService.uploadAndAnalyze(req.file, req.user.id);
    res.status(201).json(result);
  } catch (error) {
    console.log('Upload error:', error);
    next(error);
  }
};

const getDocuments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    
    const result = await documentService.getUserDocuments(req.user.id, page, limit);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

const getDocument = async (req, res, next) => {
  try {
    const document = await documentService.getDocument(req.params.id, req.user.id);
    res.json(document);
  } catch (error) {
    next(error);
  }
};

const deleteDocument = async (req, res, next) => {
  try {
    await documentService.deleteDocument(req.params.id, req.user.id);
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getDownloadUrl = async (req, res, next) => {
  try {
    const result = await documentService.getDownloadUrl(req.params.id, req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadDocument, getDocuments, getDocument, deleteDocument, getDownloadUrl };
