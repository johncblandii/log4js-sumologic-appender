'use strict';

const name = 'log4js-sumologic-appender';
const maxRetryCountDefaultValue = 10;

const appender = (config, layout) => {
  return (logEvent) => {
    const SumoLogger = require('sumo-logger');
    const maxRetryCount = config.maxRetryCount || maxRetryCountDefaultValue;

    // Duplicate so we can edit without editing the original
    let sumoConfig = {
      ...config
    };
    delete sumoConfig.type;
    delete sumoConfig.maxRetryCount;

    const sumoLogger = new SumoLogger(sumoConfig);

    let eventToSend;
    if (config.graphite) {
      eventToSend = {...logEvent.data[0]};
    } else {
      eventToSend = layout ? layout(logEvent, config.timezoneOffset) : logEvent;
    }
    return sendEvent(sumoLogger, eventToSend, maxRetryCount)
      .catch(error => console.error('Sending event to Sumo Logic failed: ' + error + ', event: ' + eventToSend));
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

const sendEvent = (sumoLogger, event, maxRetryCount, retryCount = 1) => {
  return sumoLogger.log(event)
    .catch(error => {
      if (retryCount >= maxRetryCount) {
        return Promise.reject(error);
      }

      return sendEvent(sumoLogger, event, maxRetryCount, retryCount + 1);
    });
};

module.exports = {
  name,
  appender,
  configure,
};
