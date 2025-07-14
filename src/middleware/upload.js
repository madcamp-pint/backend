const multer = require('multer');
const path = require('path');

// 파일 저장 위치 및 파일명 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // 파일을 'uploads/' 폴더에 저장
  },
  filename: (req, file, cb) => {
    // 파일명 형식: 원본파일명-타임스탬프.확장자
    const uniqueSuffix = Date.now();
    cb(null, file.originalname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

// 업로드 설정
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 100 // 파일 사이즈 제한: 100MB
  }
});

module.exports = upload; 