const TimePint = require('../model/time-pint');

const saveTimePint = async (pintData) => {
  const newPint = new TimePint(pintData);
  return await newPint.save();
};

const findTimePintById = async (id) => {
  return await TimePint.findById(id);
};

const findAllTimePints = async () => {
  return await TimePint.find().sort({ createdAt: -1 });
};

module.exports = {
  saveTimePint,
  findTimePintById,
  findAllTimePints,
};