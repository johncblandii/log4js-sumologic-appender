const log4js = require('log4js');
const SumoLogger = require('sumo-logger');

const logLevels = [
  'trace',
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
];

function getConfig(config) {
  return {
    appenders: {
      sumologic: {
        type: 'log4js-sumologic-appender',
        endpoint: 'https://sumo/logic/endpoint',
        ...config
      }
    },
    categories: {
      default: {
        appenders: ['sumologic'],
        level: 'trace'
      }
    }
  };
}

describe('appender', () => {
  beforeEach(() => {
    SumoLogger.mockClear();
  });

  test('graphite logging works', () => {
    log4js.configure(getConfig({graphite: true}));
    const logger = log4js.getLogger('graphite-tests');

    logger.info({path: 'custom/path', value: 'log here'});

    let mockInstance = SumoLogger.mock.instances[0];
    let logArgument = mockInstance.log.mock.calls[0][0];

    expect(mockInstance.log).toHaveBeenCalledTimes(1);
    expect(logArgument.path).toBe('custom/path');
    expect(logArgument.value).toBe('log here');
  });

  test('all log levels work', () => {
    log4js.configure(getConfig());
    const logger = log4js.getLogger('log-level-tests');

    // Sanity check
    expect(SumoLogger).toHaveBeenCalledTimes(0);

    for (var i = 0; i < logLevels.length; i++) {
      logger[logLevels[i]](logLevels[i], i, 'extra', 'lines', {"json": "object here"});
      var mockInstance = SumoLogger.mock.instances[i];

      // Verify the mock was called only once
      expect(mockInstance.log).toHaveBeenCalledTimes(1);
      expect(mockInstance.log.mock.calls[0][0]).toContain(`${logLevels[i]} ${i} extra lines { json: \'object here\' }`);
    }

    expect(SumoLogger).toHaveBeenCalledTimes(logLevels.length);
  });
});
