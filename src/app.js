const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const Youch = require('youch');
const Sentry = require('@sentry/node');
const sentryConfig = require('./config/sentry');
require('express-async-errors');

const database = require('./database');
const routes = require('./routes');

class App {
  constructor() {
    this.server = express();
    Sentry.init(sentryConfig);
    this.middlewares();
    this.database();
    this.routes();
    this.exceptionHandler();
  }

  middlewares() {
    this.server.use(Sentry.Handlers.requestHandler());
    this.server.use(express.json());
    this.server.use(morgan('dev'));
    this.server.use(cors());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  database() {
    database.init();
  }

  routes() {
    this.server.use(routes);
    this.server.use(Sentry.Handlers.errorHandler());
  }

  exceptionHandler() {
    this.server.use(async (err, req, res, next) => {
      if (process.env.NODE_ENV === 'development') {
        const errors = await new Youch(err, req).toJSON();

        return res.status(500).json(errors);
      }

      return res.status(500).json({ message: 'Internal server error' });
    });
  }
}

module.exports = new App().server;
