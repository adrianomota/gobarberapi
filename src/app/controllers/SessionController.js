const jwt = require('jsonwebtoken');
const Yup = require('yup');
const User = require('../models/User');
const File = require('../models/File');
const authConfig = require('../../config/auth');

class SessionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string()
        .required()
        .min(6)
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ success: false, message: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['id', 'path', 'url']
        }
      ]
    });

    if (!user) {
      return res
        .staus(400)
        .json({ success: false, data: null, message: 'User not found.' });
    }

    if (!(await user.checkPassword(password))) {
      return res.status(400).json({
        success: false,
        data: null,
        message: 'Invalid email or password.'
      });
    }

    const { id, name, provider, avatar } = user;

    return res.json({
      success: true,
      user: {
        id,
        name,
        email,
        provider,
        avatar
      },
      token: jwt.sign({ id, name, email }, authConfig.secret, {
        expiresIn: authConfig.expiresIn
      })
    });
  }
}

module.exports = new SessionController();
