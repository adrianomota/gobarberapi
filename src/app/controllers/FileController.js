const File = require('../models/File');

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path
    });

    return res.json({
      success: true,
      data: file,
      message: 'File created successfully'
    });
  }
}

module.exports = new FileController();
