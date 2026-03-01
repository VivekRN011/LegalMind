const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const documentController = require('../controllers/document.controller');
const authMiddleware = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// All routes require authentication
router.use(authMiddleware);

// Document routes with proper multer error handling
router.post('/upload', aiLimiter, (req, res, next) => {
  upload.single('document')(req, res, (err) => {
    if (err) {
      console.log('Multer error:', err.message);
      return res.status(400).json({ error: err.message });
    }
    documentController.uploadDocument(req, res, next);
  });
});
router.get('/', documentController.getDocuments);
router.get('/:id', documentController.getDocument);
router.get('/:id/download', documentController.getDownloadUrl);
router.delete('/:id', documentController.deleteDocument);

// Serve local files (for local storage mode)
router.get('/file/:fileKey', authMiddleware, (req, res) => {
  const fileKey = decodeURIComponent(req.params.fileKey);
  const filePath = path.join(__dirname, '../../uploads', fileKey);
  res.sendFile(filePath, (err) => {
    if (err) {
      res.status(404).json({ error: 'File not found' });
    }
  });
});

module.exports = router;
