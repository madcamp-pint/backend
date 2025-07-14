const express = require('express');
const passport = require('passport');
const router = express.Router();

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
  });
});

// 로그아웃
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('http://localhost:5173'); // 로그아웃 후 로그인 페이지로 리디렉션
  });
});

module.exports = router;
