const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const Pint = require('../model/pint-model');
const isAuthenticated = require('../middleware/auth-middleware'); // 인증 미들웨어 불러오기

// POST a new pint
router.post('/', isAuthenticated, upload.array('files', 10), async (req, res) => { // 미들웨어 추가
  try {
    console.log('Authenticated User:', req.user); // 로그인된 사용자 정보 로그
    console.log('Received body:', req.body);
    console.log('Received files:', req.files); // req.file -> req.files

    // 프론트엔드에서 보낸 데이터 추출
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

    // 첫 번째 이미지만 사용 (혹은 이미지 배열 처리 로직 추가)
    const image = req.files && req.files.length > 0 ? req.files[0].path : null;

    // Pint 모델 형식에 맞게 데이터 가공
    const newPint = new Pint({
      title: pintName,
      author: req.user._id, // 'test_user' -> req.user._id 로 변경
      location: {
        type: 'Point',
        coordinates: [longitude, latitude], // GeoJSON은 [경도, 위도] 순서
        address: address,
        hint: locationHint,
      },
      radius: Number(radius),
      visibility: visibility,
      image: image,
      caption: caption,
      taggedUsers: taggedUsers,
    });

    const savedPint = await newPint.save();
    res.status(201).json(savedPint);
  } catch (error) {
    console.error('Error creating pint:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 