require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('MONGODB_URI is not defined in .env file');
  process.exit(1); // 환경변수 없으면 종료
}

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(4000, () => {
    console.log('Server running');
  });
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});