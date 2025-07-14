const pintRepository = require('../repository/pint-repository');

class PintService {
  async createPint(userId, pintData) {
    const dataToSave = {
      creator: userId,
      pintName: pintData.pintName,
      radius: pintData.radius,
      visibility: pintData.visibility,
      caption: pintData.caption,
      taggedUsers: pintData.taggedUsers,
      files: pintData.files,
      location: {
        type: 'Point',
        coordinates: [pintData.longitude, pintData.latitude],
        address: pintData.address,
        hint: pintData.locationHint
      }
    };
    return await pintRepository.create(dataToSave);
  }

  async getNearbyPints(latitude, longitude, radius) {
    const coordinates = [longitude, latitude];
    return await pintRepository.findNearby(coordinates, radius);
  }

  async getUserPints(userId) {
    return await pintRepository.findByCreator(userId);
  }
}

module.exports = new PintService(); 