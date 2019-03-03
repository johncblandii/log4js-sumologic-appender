'use strict';

export const name = 'log4js-sumologic-appender';

export const appender = (config, layout) => {
  return (logEvent) => {
    const SumoLogger = require('sumo-logger');

    let sumoConfig = {...config};
    delete sumoConfig.type;

    const sumoLogger = new SumoLogger(sumoConfig);

    if (config.graphite) {
      sumoLogger.log({
        path: logEvent.data[0].path,
        value: logEvent.data[0].value
      });

      return;
    }

    sumoLogger.log(layout(logEvent, config.timezoneOffset));
  };
};

export const configure = (config, layouts) => {
  let layout = layouts.basicLayout;

  if (config.layout) {
    layout = layouts.layout(config.layout.type, config.layout);
  }

  if (!config.alwaysIncludePattern) {
    config.alwaysIncludePattern = false;
  }

  return appender(config, layout);
};
