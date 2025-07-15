const TimePint = require('../model/time-pint');

const createTimePint = async (req, res) => {
  try {
    const { name, openDate, isPublic, tags, content } = req.body;
    const file = req.file;

    const newPint = new TimePint({
      name,
      openDate,
      isPublic: isPublic === 'true',
      tags: tags ? JSON.parse(tags) : [],
      content,
      mediaUrl: file ? `/uploads/${file.filename}` : null,
    });

    await newPint.save();

    console.log('Time PINT success:', {
      name: newPint.name,
      openDate: newPint.openDate,
      isPublic: newPint.isPublic,
      tags: newPint.tags,
      mediaUrl: newPint.mediaUrl,
      content: newPint.content,
    });

    res.status(201).json({ message: 'Time PINT 생성 완료', pint: newPint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Time PINT 생성 실패', error: err });
  }
};

module.exports = { createTimePint };