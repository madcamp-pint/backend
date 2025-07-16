const timePintService = require('../service/time-pint-service');

const createTimePint = async (req, res) => {
  try {
    const { name, openDate, isPublic, tags, content } = req.body;
    const file = req.file;

    const newPint = await timePintService.createTimePint({
      name,
      openDate,
      isPublic,
      tags,
      content,
      mediaUrl: file ? `/uploads/${file.filename}` : null,
    });

    console.log('Time PINT success:', newPint);

    res.status(201).json({ message: 'Time PINT 생성 완료', pint: newPint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Time PINT 생성 실패', error: err });
  }
};

const getAllTimePints = async (req, res) => {
  try {
    const allPints = await timePintService.getAllTimePints();
    res.status(200).json(allPints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Time PINT 목록 불러오기 실패', error: err });
  }
};

module.exports = {
  createTimePint,
  getAllTimePints,
};