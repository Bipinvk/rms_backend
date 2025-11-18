const multer = require('multer');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Initialize S3 v3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const upload = multer({ storage: multer.memoryStorage() });

const uploadToS3 = upload.single('file');

const handleUpload = (req, res, next) => {
  uploadToS3(req, res, async (err) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!req.file) return res.status(400).json({ msg: 'No file uploaded' });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `documents/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      req.fileUrl = `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${params.Key}`;
      next();
    } catch (err) {
      console.error('S3 Upload Error:', err);
      res.status(500).json({ msg: 'Upload failed: ' + err.message });
    }
  });
};

module.exports = { handleUpload };  // Ensure this export