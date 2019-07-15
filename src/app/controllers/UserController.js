const Yup = require('yup');
const User = require('../models/User');
const File = require('../models/File');

class UserController {
  async index(req, res) {
    const user = await User.findAll({
      where: {},
      attributes: ['id', 'name', 'email', 'provider', 'avatar_id'],
      include: [{ model: File, as: 'avatar', attributes: ['name', 'path'] }]
    });

    return res.json({ success: true, data: user });
  }

  async show(req, res) {
    const existUser = await User.findByPk(req.userId);

    if (!existUser)
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });

    return res.status(200).json(existUser);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
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

    const existUser = await User.findOne({ where: { email: req.body.email } });

    if (existUser) {
      return res
        .status(400)
        .json({ success: false, data: null, message: 'User already exist.' });
    }

    const { id, name, email, provider } = await User.create(req.body);

    return res.status(200).json({
      success: true,
      data: {
        id,
        name,
        email,
        provider
      },
      message: 'User created successfully'
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),

      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ) //
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ success: false, message: 'Validation fails' });
    }

    const userExists = await User.findByPk(req.userId);

    if (!userExists) {
      return res
        .status(400)
        .json({ success: false, data: null, message: 'USet not found' });
    }

    if (userExists.email !== req.body.email) {
      const userExistsWithEmailSended = User.findOne({
        where: { email: req.body.email }
      });

      if (userExistsWithEmailSended)
        return res
          .status(400)
          .json({ success: false, message: 'User already exists' });
    }

    const { id, name, email, provider } = await userExists.update(req.body);

    return res.status(200).json({
      success: true,
      data: {
        id,
        name,
        email,
        provider
      },
      message: 'User updated successfully'
    });
  }
}

module.exports = new UserController();
