[![NPM](https://img.shields.io/npm/v/log4js-sumologic-appender.svg?style=for-the-badge)](https://www.npmjs.com/package/log4js-sumologic-appender) ![npm](https://img.shields.io/npm/dt/log4js-sumologic-appender.svg?style=for-the-badge) [![codecov](https://img.shields.io/codecov/c/github/johncblandii/log4js-sumologic-appender.svg?style=for-the-badge)](https://codecov.io/gh/johncblandii/log4js-sumologic-appender) ![CircleCI branch](https://img.shields.io/circleci/project/github/johncblandii/log4js-sumologic-appender/master.svg?style=for-the-badge)

![Code Climate maintainability](https://img.shields.io/codeclimate/maintainability/johncblandii/log4js-sumologic-appender.svg?style=for-the-badge) [![Total alerts](https://img.shields.io/lgtm/alerts/g/johncblandii/log4js-sumologic-appender.svg?style=for-the-badge&logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/johncblandii/log4js-sumologic-appender/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/johncblandii/log4js-sumologic-appender.svg?style=for-the-badge&logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/johncblandii/log4js-sumologic-appender/context:javascript)

# log4js-sumologic-appender

A simple log4js appender for SumoLogic with graphite metrics support.

## Install

Install with `npm` or `yarn`:

```bash
$ npm install --save log4js-sumologic-appender

$ yarn add log4js-sumologic-appender
```

## Example use

``` js
  const log4js = require('log4js');

  log4js.configure({
    appenders: {
      sumologic: {
        type: 'log4js-sumologic-appender',
        endpoint: 'http://sumo/endpoint/here',
        // See config options here: https://github.com/SumoLogic/js-sumo-logger#configuration
      }
    },
    categories: {
      default: {
        appenders: ['sumologic'],
        level: 'trace'
      }
    }
  });

  const logger = log4js.getLogger('My App Name'); // name your logger

  logger.trace('trace', 'extra', 'lines', {"json": "object here"});
  logger.debug('debug', 'extra', 'lines', {"json": "object here"});
  logger.info('info', 'extra', 'lines', {"json": "object here"});
  logger.warn('warn', 'extra', 'lines', {"json": "object here"});
  logger.error('error', 'extra', 'lines', {"json": "object here"});
  logger.fatal('fatal', 'extra', 'lines', {"json": "object here"});
```

See [example](example/) for a working example.

#### Error handling

In case requests to Sumo Logic fail, appender performs up to 10 retries. To override the default value for the number of retries add a `maxRetryCount` property to Sumo Logic appender config:

``` js
  sumologic: {
    type: 'log4js-sumologic-appender',
    endpoint: 'http://sumo/endpoint/here',
    maxRetryCount: 5,
    ...
  }
```

If none of the retries are completed successfully, an error message will be written to stderr. 
