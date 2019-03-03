const log4js = require('log4js');
const SumoLogger = require('sumo-logger');

import * as sumoAppender from './index';

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

  test('general', () => {
    expect(sumoAppender.name).toEqual('log4js-sumologic-appender');
    expect(sumoAppender.appender).toBeDefined();
    expect(sumoAppender.configure).toBeDefined();
  });

  describe('appender', () => {
    test('handles null layouts', () => {
      const config = getConfig();
      const logEvent = 'custom event';

      const appender = sumoAppender.appender(config, null);
      expect(() => appender(logEvent)).not.toThrow();

      let mockInstance = SumoLogger.mock.instances[0];
      expect(mockInstance.log).toHaveBeenNthCalledWith(1, logEvent);
    });

    test('removes `type` from the config', () => {
      const config = {
        ...getConfig(),
        type: 'anything'
      };
      const logEvent = 'custom event';

      const appender = sumoAppender.appender(config, null);
      expect(() => appender(logEvent)).not.toThrow();

      let mockInstance = SumoLogger.mock.instances[0];
      expect(mockInstance.log).toHaveBeenNthCalledWith(1, logEvent);

      const passedConfig = SumoLogger.mock.calls[0][0];
      expect(passedConfig.type).toBeUndefined();
      expect(passedConfig.appenders).not.toBeUndefined();
      expect(passedConfig.categories).not.toBeUndefined();

      // verify it didn't edit the passed in config
      expect(config.type).toBe('anything');
    });

    test('passes log event and timezone offset to layout', () => {
      const timezoneOffset = "hi"
      const config = {
        timezoneOffset
      };
      const layout = jest.fn();
      const layoutResult = 'layout result';
      const logEvent = 'custom event';

      layout.mockReturnValue(layoutResult);

      const appender = sumoAppender.appender(config, layout);
      appender(logEvent);

      expect(layout).toHaveBeenNthCalledWith(1, logEvent, timezoneOffset);

      let mockInstance = SumoLogger.mock.instances[0];
      expect(mockInstance.log).toHaveBeenNthCalledWith(1, layoutResult);
    });
  });

  describe('configure', () => {
    const timezoneOffset = 'tz';
    const config = {
      ...getConfig(),
      timezoneOffset,
    };
    const layouts = {
      basicLayout: jest.fn(),
      layout: jest.fn(),
    };
    const logEvent = 'hello';

    test('defaults to layouts.basicLayout', () => {
      const logger = sumoAppender.configure(config, layouts);
      logger(logEvent);

      expect(layouts.basicLayout).toHaveBeenNthCalledWith(1, logEvent, timezoneOffset);
    });

    test('defaults config.alwaysIncludePattern to false', () => {
      const logger = sumoAppender.configure(config, layouts);
      logger(logEvent);

      const instanceConfig = SumoLogger.mock.calls[0][0]

      expect(instanceConfig.alwaysIncludePattern).toBeFalsy();
    });

    test('allows config.alwaysIncludePattern customization', () => {
      const logger = sumoAppender.configure({
        ...config,
        alwaysIncludePattern: true
      }, layouts);
      logger(logEvent);

      const instanceConfig = SumoLogger.mock.calls[0][0]

      expect(instanceConfig.alwaysIncludePattern).toBeTruthy();
    });

    test('uses a custom layout', () => {
      const customLayout = {
        type: 'custom type'
      };
      const layoutHandler = jest.fn();
      layouts.layout.mockReturnValue(layoutHandler);

      const logger = sumoAppender.configure({
        ...config,
        layout: customLayout
      }, layouts);
      logger(logEvent);

      expect(layouts.layout).toHaveBeenNthCalledWith(1, customLayout.type, customLayout);
      expect(layouts.basicLayout).not.toHaveBeenNthCalledWith(1, logEvent, timezoneOffset);
      expect(layoutHandler).toHaveBeenNthCalledWith(1, logEvent, timezoneOffset);
    });
  });

  describe('log4js integration', () => {
    test('graphite logging works', () => {
      log4js.configure(getConfig({
        graphite: true
      }));
      const logger = log4js.getLogger('graphite-tests');

      logger.info({
        path: 'custom/path',
        value: 'log here'
      });

      let mockInstance = SumoLogger.mock.instances[0];

      expect(mockInstance.log).toHaveBeenNthCalledWith(1, {
        path: 'custom/path',
        value: 'log here'
      });
    });

    test('all log levels work', () => {
      log4js.configure(getConfig());
      const logger = log4js.getLogger('log-level-tests');

      // Sanity check
      expect(SumoLogger).toHaveBeenCalledTimes(0);

      for (var i = 0; i < logLevels.length; i++) {
        logger[logLevels[i]](logLevels[i], i, 'extra', 'lines', {
          "json": "object here"
        });
        var mockInstance = SumoLogger.mock.instances[i];

        // Verify the mock was called only once
        expect(mockInstance.log).toHaveBeenCalledTimes(1);
        expect(mockInstance.log.mock.calls[0][0]).toContain(`${logLevels[i]} ${i} extra lines { json: \'object here\' }`);
      }

      expect(SumoLogger).toHaveBeenCalledTimes(logLevels.length);
    });
  });
});
