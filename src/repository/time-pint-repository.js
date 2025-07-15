const TimePint = require('../model/time-pint');

const saveTimePint = async (pintData) => {
  const newPint = new TimePint(pintData);
  return await newPint.save();
};

const findAllTimePints = async () => {
  return await TimePint.find().sort({ createdAt: -1 });
};

module.exports = {
  saveTimePint,
  findAllTimePints,
};