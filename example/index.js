const log4js = require('log4js');

log4js.configure({
  appenders: {
    cheese: {
      type: 'file',
      filename: 'cheese.log'
    },
    sumologic: {
      type: 'sumologic-log4js-appender',
      endpoint: process.env.SUMO_ENDPOINT,
      graphite: false,
      // See config options here: https://github.com/SumoLogic/js-sumo-logger#configuration
    },
    metrics: {
      type: 'sumologic-log4js-appender',
      endpoint: process.env.SUMO_ENDPOINT,
      graphite: true,
    }
  },
  categories: {
    default: {
      appenders: ['cheese', 'sumologic'],
      level: 'trace'
    },
    metrics: {
      appenders: ['metrics'],
      level: 'trace'
    },
  }
});

const loggerWithSumo = log4js.getLogger('My App Name');
loggerWithSumo.trace('trace', 'extra', 'lines', {
  "json": "object here"
}, new Date());
loggerWithSumo.debug('debug', 'extra', 'lines', {
  "json": "object here"
}, new Date());
loggerWithSumo.info('info', 'extra', 'lines', {
  "json": "object here"
}, new Date());
loggerWithSumo.warn('warn', 'extra', 'lines', {
  "json": "object here"
}, new Date());
loggerWithSumo.error('error', 'extra', 'lines', {
  "json": "object here"
}, new Date());
loggerWithSumo.fatal('fatal', 'extra', 'lines', {
  "json": "object here"
}, new Date());


/*
 * Test Sumo metrics logging
 */

const metricsLogger = log4js.getLogger('metrics');

for (var i = 0, len = 10; i < len; i++) {
  metricsLogger.info({
    path: 'my.metrics',
    value: i * Math.round(Math.random() * 100)
  });
}

metricsLogger.info({
  path: 'page.Home',
  value: Math.round(Math.random() * 100)
});
metricsLogger.info({
  path: 'page.About',
  value: Math.round(Math.random() * 100)
});
metricsLogger.info({
  path: 'page.ContactUs',
  value: Math.round(Math.random() * 100)
});
