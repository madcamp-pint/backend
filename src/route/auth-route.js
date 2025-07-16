const express = require('express');
const passport = require('passport');
const router = express.Router();
const isAuthenticated = require('../middleware/auth-middleware');
const User = require('../model/user-model');

// 로그인 시작
router.get('/kakao', passport.authenticate('kakao'));

// 로그인 콜백
router.get('/kakao/callback',
  passport.authenticate('kakao', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:5173/main'); // 로그인 성공 시 FE 메인페이지로 이동
  }
);

// 로그인된 사용자 정보 확인
router.get('/user', (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  res.json({
    id: req.user._id,
    nickname: req.user.nickname,
    email: req.user.email,
    profileImage: req.user.profileImage,
    introduction: req.user.introduction,
    userName: req.user.userName,
    link: req.user.link,
  });
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173'); // 로그아웃 후 로그인 페이지로 리디렉션
  });
});

router.get('/check-username', async (req, res) => {
  const { userName } = req.query;
  if (!userName) return res.json({ duplicate: false });
  const exists = await User.findOne({ userName });
  res.json({ duplicate: !!exists });
})

router.post('/update-profile', isAuthenticated, async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: '로그인이 필요합니다.' });
    const kakaoId = req.user.kakaoId;
    const { introduction, userName, link, email } = req.body;

    // userName 중복 체크 (본인 제외)
    if (userName) {
      const exists = await User.findOne({ userName, kakaoId: { $ne: kakaoId } });
      if (exists) return res.status(409).json({ message: '이미 사용 중인 ID입니다.' });
    }

    await User.updateOne(
      { kakaoId },
      { $set: { email, link, introduction, userName } }
    );
    res.json({ success: true });
  } catch (err) {
    console.error('update-profile 에러:', err);
    res.status(500).json({ message: '업데이트 실패', error: err.message });
  }
});

router.get('/list', isAuthenticated, async (req, res) => {
  const user = await User.findById(req.user._id).populate('friends');
  res.json(user.friends);
});

router.post('/add', isAuthenticated, async (req, res) => {
  try {
    console.log('친구 추가 시도');
    const userId = req.user._id;
    const { friendID } = req.body;
    console.log('받은 friendID (userName):', friendID);

    if (!friendID) return res.status(400).json({ message: '친구 ID 필요' });

    // friendID 는 userName 이므로, userName으로 유저 찾기
    const friend = await User.findOne({ userName: friendID });
    if (!friend) return res.status(404).json({ message: '존재하지 않는 유저' });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: '유저를 찾을 수 없습니다.' });

    user.friends = user.friends || [];
    if (user.friends.some(f => f.toString() === friend._id.toString())) {
      return res.status(400).json({ message: '이미 친구입니다.' });
    }

    user.friends.push(friend._id);
    await user.save();

    res.json({ message: '친구 추가 성공' });
  } catch (err) {
    console.error('친구 추가 에러:', err);
    res.status(500).json({ message: '서버 에러', error: err.message });
  }
});


module.exports = router;
;
