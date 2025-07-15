const timePintRepository = require('../repository/time-pint-repository');

const createTimePint = async ({ name, openDate, isPublic, tags, content, mediaUrl }) => {
  const pintData = {
    name,
    openDate,
    isPublic: isPublic === 'true',
    tags: tags ? JSON.parse(tags) : [],
    content,
    mediaUrl,
  };

  return await timePintRepository.saveTimePint(pintData);
};

const getAllTimePints = async () => {
  return await timePintRepository.findAllTimePints();
};

module.exports = {
  createTimePint,
  getAllTimePints,
};