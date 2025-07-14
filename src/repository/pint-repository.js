const Pint = require('../model/pint-model');

class PintRepository {
  async create(pintData) {
    const pint = new Pint(pintData);
    return await pint.save();
  }

  async findNearby(coordinates, maxDistance) {
    return await Pint.find({
      'location.coordinates': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: coordinates
          },
          $maxDistance: maxDistance
        }
      },
      visibility: 'public'
    }).populate('creator', 'nickname profileImage');
  }

  async findByCreator(userId) {
    return await Pint.find({ creator: userId })
      .populate('creator', 'nickname profileImage')
      .sort({ createdAt: -1 });
  }
}

module.exports = new PintRepository(); 