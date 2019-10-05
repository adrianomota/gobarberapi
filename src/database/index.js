const Sequelize = require('sequelize');
const mongoose = require('mongoose');

const User = require('../app/models/User');
const File = require('../app/models/File');
const Appointment = require('../app/models/Appointment');

const databaseConfig = require('../config/database');
const mongoConfig = require('../config/mongo');

const models = [User, File, Appointment];

class Database {
  constructor() {
    this.init();
    this.mongo();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }

  mongo() {
    this.mongoConnection = mongoose
      .connect(mongoConfig.MONGO_URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      .then(() => console.log('connecting to database successful'))
      .catch(err => console.error('could not connect to mongo DB', err));
  }
}

module.exports = new Database();
