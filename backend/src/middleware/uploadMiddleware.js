require('dotenv').config();
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');

console.log("--- Upload Middleware Init ---");
console.log("IMG_UPLOAD:", process.env.IMG_UPLOAD);
console.log("CLOUDINARY_URL Present:", !!process.env.CLOUDINARY_URL);

// Ensure upload directory exists for local storage
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = process.env.IMG_UPLOAD === 'cloud' && process.env.CLOUDINARY_URL
    ? new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'vericode_uploads',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'],
        },
      })
    : multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename: (req, file, cb) => {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
        }
      });

const upload = multer({ storage: storage });

module.exports = upload;
