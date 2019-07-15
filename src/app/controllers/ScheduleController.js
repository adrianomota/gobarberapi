const { startOfDay, endOfDay, parseISO } = require('date-fns');
const { Op } = require('sequelize');

const Appointment = require('../models/Appointment');
const User = require('../models/User');

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: {
        id: req.userId,
        provider: true
      }
    });

    if (!checkUserProvider) {
      return res.status(401).json({
        success: false,
        message: 'User is not a provider.'
      });
    }

    const { date } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)]
        }
      },

      order: ['date']
    });

    return res.json({ success: true, data: appointments });
  }
}

module.exports = new ScheduleController();
