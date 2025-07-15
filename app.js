require('dotenv').config();
console.log('--- app.js started ---'); // 진입 확인 로그

const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors'); // cors import

const authRoute = require('./src/route/auth-route');
const pintRoute = require('./src/route/pint-route');          // 장소 기반 캡슐
const timePintRoute = require('./src/route/time-pint-route'); // 시간 기반 캡슐

// 파일 로드 확인 로그
console.log('--- pint-route.js loaded ---');
console.log('--- time-pint-route.js loaded ---');

const app = express();

// 업로드 폴더를 정적 경로로 설정
app.use('/uploads', express.static('uploads'));

// CORS 미들웨어 설정
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/pints', pintRoute);
app.use('/api/pints', pintRoute);           // 장소 기반 캡슐
app.use('/api/time-pints', timePintRoute);  // 시간 기반 캡슐

module.exports = app;