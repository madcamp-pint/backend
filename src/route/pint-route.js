const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Pint = require('../model/pint-model');
const isAuthenticated = require('../middleware/auth-middleware'); // 인증 미들웨어 불러오기
const pintService = require('../service/pint-service');

// POST a new pint
router.post('/', isAuthenticated, upload.array('files', 10), async (req, res) => { // 미들웨어 추가
  try {
    // 프론트엔드에서 보낸 데이터 추출 (가장 먼저 선언)
    const {
      pintName, // title
      latitude,
      longitude,
      address,
      locationHint,
      radius,
      visibility,
      caption,
      taggedUsers,
    } = req.body;

    console.log('Authenticated User:', req.user); // 로그인된 사용자 정보 로그
    console.log('프론트에서 받은 핀트 정보:', {
      pintName,
      latitude,
      longitude,
      address,
      locationHint,
      radius,
      visibility,
      caption,
      taggedUsers,
      files: req.files
    });

    // 첫 번째 이미지만 사용 (혹은 이미지 배열 처리 로직 추가)
    const images = req.files ? req.files.map(f => f.path) : [];

    // Pint 모델 형식에 맞게 데이터 가공
    const newPint = new Pint({
      title: pintName,
      creator: req.user._id, // 'test_user' -> req.user._id 로 변경
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // GeoJSON은 [경도, 위도] 순서
        address: address,
        hint: locationHint,
      },
      radius: Number(radius),
      visibility: visibility,
      images: images,
      caption: caption,
      taggedUsers: taggedUsers,
    });

    const savedPint = await newPint.save();
    console.log("저장 성공"); // ← 이 부분이 터미널에 출력됩니다.
    res.status(201).json(savedPint);
  } catch (error) {
    console.error('Error creating pint:', error);
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', isAuthenticated, async (req, res) => {
  try {
    const pint = await Pint.findByIdAndDelete(req.params.id);
    if (!pint) return res.status(404).json({ message: 'Not found' });
    res.json({ message: '삭제 성공' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 내 핀트 불러오기
router.get('/my', isAuthenticated, async (req, res) => {
  const userId = req.user._id;
  const myPints = await pintService.getUserPints(userId);
  res.json(myPints);
  // 내 핀트의 images 필드 콘솔 출력
  myPints.forEach((pint, idx) => {
    console.log(`[${idx}] Pint images:`, pint.images);
  });
});



module.exports = router; 