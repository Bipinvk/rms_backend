const multer = require('multer');
const AWS = require('aws-sdk');
require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const s3 = new AWS.S3();
const upload = multer({ storage: multer.memoryStorage() });

const uploadToS3 = upload.single('file');

const handleUpload = (req, res, next) => {
  uploadToS3(req, res, async (err) => {
    if (err) return res.status(400).json({ msg: err.message });
    if (!req.file) return res.status(400).json({ msg: 'No file' });

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `documents/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype
    };

    try {
      const { Location } = await s3.upload(params).promise();
      req.fileUrl = Location;
      next();
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  });
};

module.exports = { handleUpload };