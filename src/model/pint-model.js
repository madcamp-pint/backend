const mongoose = require('mongoose');

const pintSchema = new mongoose.Schema({
  // 프론트엔드에서 'pintName'으로 보내주므로 필드명을 'title'로 유지
  title: {
    type: String,
    required: true,
  },
  creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  // 위치 정보를 GeoJSON 형식으로 저장
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude] 순서
      required: true
    },
    address: {
      type: String,
    },
    hint: {
      type: String,
    }
  },
  radius: {
    type: Number,
    enum: [10, 50, 100],
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private'],
    default: 'public'
  },
  image: { // 프론트에서는 'files'로 여러 개를 보낼 수 있지만, 여기서는 첫 번째만 저장
    type: String,
  },
  caption: {
    type: String,
  },
  taggedUsers: { // JSON 문자열로 받으므로 일단 String으로 처리
    type: String,
  }
}, { timestamps: true });

// GeoJSON 쿼리를 위한 인덱스 생성
pintSchema.index({ 'location.coordinates': '2dsphere' });

const Pint = mongoose.model('Pint', pintSchema);

module.exports = Pint; 