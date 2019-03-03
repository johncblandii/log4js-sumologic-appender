'use strict';

const name = 'log4js-sumologic-appender';

const appender = (config, layout) => {
  return (logEvent) => {
    const SumoLogger = require('sumo-logger');

    // Duplicate so we can edit without editing the original
    let sumoConfig = {
      ...config
    };
    delete sumoConfig.type;

    const sumoLogger = new SumoLogger(sumoConfig);

    if (config.graphite) {
      sumoLogger.log({
        ...logEvent.data[0],
      });

      return;
    }

    sumoLogger.log(layout ? layout(logEvent, config.timezoneOffset) : logEvent);
  };
};

const configure = (config, layouts) => {
  let layout = layouts.basicLayout;

  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  if (!config.alwaysIncludePattern) {
    config.alwaysIncludePattern = false;
  }

  return appender(config, layout);
};

module.exports = {
  name,
  appender,
  configure,
}
