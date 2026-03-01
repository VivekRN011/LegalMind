const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const config = require('../config');
const logger = require('../config/logger');

class S3Service {
  constructor() {
    // Check if real AWS credentials are configured
    // Uses local storage if:
    // - USE_LOCAL_STORAGE env is set to true
    // - AWS credentials are missing or contain placeholder text
    const forceLocal = process.env.USE_LOCAL_STORAGE === 'true';
    const hasValidKey = config.aws.accessKeyId && 
                        !config.aws.accessKeyId.includes('your') &&
                        !config.aws.accessKeyId.includes('YOUR') &&
                        config.aws.accessKeyId.startsWith('AKIA');
    
    this.useLocalStorage = forceLocal || !hasValidKey;
    
    if (!this.useLocalStorage) {
      this.s3 = new AWS.S3({
        accessKeyId: config.aws.accessKeyId,
        secretAccessKey: config.aws.secretAccessKey,
        region: config.aws.region
      });
      this.bucket = config.aws.bucket;
    } else {
      // Use local uploads directory
      this.uploadsDir = path.join(__dirname, '../../uploads');
      this.ensureUploadsDir();
      logger.info('S3 Service: Using local storage (AWS credentials not configured)');
    }
  }

  async ensureUploadsDir() {
    try {
      await fs.mkdir(this.uploadsDir, { recursive: true });
    } catch (error) {
      // Directory may already exist
    }
  }

  async uploadFile(file, userId) {
    const fileKey = `contracts/${userId}/${uuidv4()}-${file.originalname}`;

    if (this.useLocalStorage) {
      // Store locally
      const localPath = path.join(this.uploadsDir, fileKey);
      await fs.mkdir(path.dirname(localPath), { recursive: true });
      await fs.writeFile(localPath, file.buffer);
      logger.info(`File saved locally: ${fileKey}`);
      return fileKey;
    }

    const params = {
      Bucket: this.bucket,
      Key: fileKey,
      Body: file.buffer,
      ContentType: file.mimetype
    };

    try {
      await this.s3.upload(params).promise();
      logger.info(`File uploaded to S3: ${fileKey}`);
      return fileKey;
    } catch (error) {
      logger.error('S3 upload error:', error);
      throw new Error('Failed to upload file to storage');
    }
  }

  async getSignedUrl(fileKey, expiresIn = 3600) {
    if (this.useLocalStorage) {
      // Return local file path for development
      return `/api/documents/file/${encodeURIComponent(fileKey)}`;
    }

    const params = {
      Bucket: this.bucket,
      Key: fileKey,
      Expires: expiresIn
    };

    try {
      const url = await this.s3.getSignedUrlPromise('getObject', params);
      return url;
    } catch (error) {
      logger.error('S3 signed URL error:', error);
      throw new Error('Failed to generate file URL');
    }
  }

  async deleteFile(fileKey) {
    if (this.useLocalStorage) {
      const localPath = path.join(this.uploadsDir, fileKey);
      try {
        await fs.unlink(localPath);
        logger.info(`File deleted locally: ${fileKey}`);
      } catch (error) {
        // File may not exist
      }
      return;
    }

    const params = {
      Bucket: this.bucket,
      Key: fileKey
    };

    try {
      await this.s3.deleteObject(params).promise();
      logger.info(`File deleted from S3: ${fileKey}`);
    } catch (error) {
      logger.error('S3 delete error:', error);
      throw new Error('Failed to delete file from storage');
    }
  }
}

module.exports = new S3Service();
