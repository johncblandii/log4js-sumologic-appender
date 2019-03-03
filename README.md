[![CircleCI](https://circleci.com/gh/johncblandii/log4js-sumologic-appender/tree/master.svg?style=svg)](https://circleci.com/gh/johncblandii/log4js-sumologic-appender/tree/master) [![Maintainability](https://api.codeclimate.com/v1/badges/73fd2e8dcc79c645c55e/maintainability)](https://codeclimate.com/github/johncblandii/log4js-sumologic-appender/maintainability) [![Test Coverage](https://api.codeclimate.com/v1/badges/73fd2e8dcc79c645c55e/test_coverage)](https://codeclimate.com/github/johncblandii/log4js-sumologic-appender/test_coverage)

[![Total alerts](https://img.shields.io/lgtm/alerts/g/johncblandii/log4js-sumologic-appender.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/johncblandii/log4js-sumologic-appender/alerts/) [![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/johncblandii/log4js-sumologic-appender.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/johncblandii/log4js-sumologic-appender/context:javascript)

# log4js-sumologic-appender

A simple log4js appender for SumoLogic.

## Install

Install with `npm` or `yarn`:

```bash
$ npm install --save log4js-logentries-appender

$ yarn add log4js-logentries-appender
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
