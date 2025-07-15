const express = require('express');
const router = express.Router();
const { createTimePint, getAllTimePints } = require('../controller/time-pint-controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 업로드 경로 설정
const uploadPath = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });

// multer 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', upload.single('media'), createTimePint);
router.get('/', getAllTimePints);

module.exports = router;