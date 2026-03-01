const pdfParse = require('pdf-parse');
const fs = require('fs').promises;
const path = require('path');
const prisma = require('../config/database');
const s3Service = require('./s3.service');
const aiService = require('./ai.service');
const logger = require('../config/logger');

class DocumentService {
  async uploadAndAnalyze(file, userId) {
    // Check user's document limit
    const user = await prisma.user.findUnique({ where: { id: userId } });
    
    if (user.documentsUsed >= user.documentsLimit) {
      const error = new Error(`Document limit reached (${user.documentsLimit}). Please upgrade your plan.`);
      error.statusCode = 403;
      throw error;
    }

    // Upload to S3
    const s3Key = await s3Service.uploadFile(file, userId);

    // Extract text from PDF (lenient - don't fail if parsing fails)
    let extractedText = '';
    try {
      // Try to parse from buffer first
      let pdfBuffer = file.buffer;
      
      // If buffer is not available, try to read from saved file (for local storage)
      if (!pdfBuffer || pdfBuffer.length === 0) {
        const localPath = path.join(__dirname, '../../uploads', s3Key);
        logger.info(`Reading PDF from local path: ${localPath}`);
        pdfBuffer = await fs.readFile(localPath);
      }
      
      logger.info(`PDF buffer size: ${pdfBuffer?.length || 0} bytes`);
      
      const pdfData = await pdfParse(pdfBuffer);
      extractedText = pdfData.text || '';
      logger.info(`Extracted ${extractedText.length} characters from PDF`);
      
      // Log a sample of extracted text for debugging
      if (extractedText.length > 0) {
        logger.info(`PDF text sample: ${extractedText.substring(0, 200)}...`);
      }
    } catch (error) {
      logger.warn('PDF parsing warning (continuing without text):', error.message || error);
      // Continue without extracted text - don't fail the upload
    }

    // Analyze with AI (only if we have text)
    let analysis = null;
    if (extractedText && extractedText.trim().length >= 50) {
      try {
        logger.info('Starting AI analysis...');
        analysis = await aiService.analyzeContract(extractedText);
        logger.info('AI analysis completed:', analysis ? 'success' : 'no result');
      } catch (error) {
        logger.error('AI analysis error:', error.message || error);
      }
    } else {
      logger.warn(`Skipping AI analysis - insufficient text (${extractedText.trim().length} chars, need 50+)`);
    }

    // Normalize the summary - convert to string if it's an object
    let summaryText = null;
    if (analysis?.summary) {
      if (typeof analysis.summary === 'string') {
        summaryText = analysis.summary;
      } else if (typeof analysis.summary === 'object') {
        // AI returned structured summary, convert to readable text
        summaryText = Object.entries(analysis.summary)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n\n');
      }
    }

    // Save document to database
    const document = await prisma.document.create({
      data: {
        userId,
        fileName: file.originalname,
        s3Key,
        summary: summaryText,
        riskNotes: analysis?.riskClauses ? JSON.stringify(analysis.riskClauses) : null,
        overallRisk: analysis?.overallRiskLevel || null,
        recommendations: analysis?.recommendations ? JSON.stringify(analysis.recommendations) : null,
        status: analysis ? 'ANALYZED' : 'UPLOADED'
      }
    });

    // Increment user's document count
    await prisma.user.update({
      where: { id: userId },
      data: { documentsUsed: { increment: 1 } }
    });

    logger.info(`Document uploaded and analyzed: ${document.id}`);

    return {
      document,
      analysis
    };
  }

  async getUserDocuments(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        select: {
          id: true,
          fileName: true,
          summary: true,
          overallRisk: true,
          status: true,
          createdAt: true
        }
      }),
      prisma.document.count({ where: { userId } })
    ]);

    return {
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }

  async getDocument(documentId, userId) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId
      }
    });

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    // Generate signed URL for viewing
    const viewUrl = await s3Service.getSignedUrl(document.s3Key);

    return {
      ...document,
      riskNotes: document.riskNotes ? JSON.parse(document.riskNotes) : [],
      recommendations: document.recommendations ? JSON.parse(document.recommendations) : [],
      viewUrl
    };
  }

  async deleteDocument(documentId, userId) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId
      }
    });

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    // Delete from S3
    await s3Service.deleteFile(document.s3Key);

    // Delete from database
    await prisma.document.delete({ where: { id: documentId } });

    // Decrement user's document count
    await prisma.user.update({
      where: { id: userId },
      data: { documentsUsed: { decrement: 1 } }
    });

    logger.info(`Document deleted: ${documentId}`);
  }

  async reanalyzeDocument(documentId, userId) {
    const document = await prisma.document.findFirst({
      where: { id: documentId, userId }
    });

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    // Get file from S3 and re-extract text
    // For simplicity, we'll need the original file
    const error = new Error('Re-analysis requires re-uploading the document');
    error.statusCode = 400;
    throw error;
  }

  async getDownloadUrl(documentId, userId) {
    const document = await prisma.document.findFirst({
      where: {
        id: documentId,
        userId
      }
    });

    if (!document) {
      const error = new Error('Document not found');
      error.statusCode = 404;
      throw error;
    }

    // Generate signed URL for download
    const url = await s3Service.getSignedUrl(document.s3Key);

    return {
      url,
      fileName: document.fileName
    };
  }
}

module.exports = new DocumentService();
