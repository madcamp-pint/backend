const isAuthenticated = (req, res, next) => {
  // Passport가 제공하는 req.isAuthenticated() 메서드로 로그인 상태를 확인합니다.
  if (req.isAuthenticated()) {
    // 로그인 상태이면 다음 미들웨어 또는 라우트 핸들러로 넘어갑니다.
    return next();
  }
  // 로그인 상태가 아니면 401 Unauthorized 에러를 응답합니다.
  res.status(401).json({ message: '접근 권한이 없습니다. 로그인이 필요합니다.' });
};

module.exports = isAuthenticated; 