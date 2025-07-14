require('dotenv').config();
console.log('--- app.js started ---'); // 진입 확인 로그

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors'); // cors import

const authRoute = require('./src/route/auth-route');
const pintRoute = require('./src/route/pint-route'); // pintRoute 추가
console.log('--- pint-route.js loaded ---'); // 파일 로드 확인 로그

const app = express();

// 업로드 폴더를 정적 경로로 설정
app.use('/uploads', express.static('uploads'));

// CORS 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:5173', // 5174 -> 5173으로 수정
  credentials: true,
}));

app.use(express.json());

app.use(session({
  secret: 'secretKey',
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const User = require('./src/model/user-model');
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

require('./src/passport/kakao-strategy')(passport);

// 테스트용 라우트
app.get('/test', (req, res) => {
  console.log('--- /test route accessed ---');
  res.status(200).send('Backend server is alive!');
});

app.use('/auth', authRoute);
app.use('/api/pints', pintRoute); // 다시 원래 경로로 복구

module.exports = app;