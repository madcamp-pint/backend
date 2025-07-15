const express = require('express');
const router = express.Router();
const { createTimePint } = require('../controller/time-pint-controller');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 파일 업로드 경로
const uploadPath = path.join(__dirname, '../../uploads'); 

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post('/', upload.single('media'), createTimePint);

module.exports = router;