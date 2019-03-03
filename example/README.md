# log4js-sumologic-appender Example Application

## Prerequisites

* Create a free [SumoLogic account](https://help.sumologic.com/01Start-Here/02Getting-Started/01-How-to-Sign-Up-for-Sumo-Logic) and [generate an HTTP collector](https://help.sumologic.com/03Send-Data/Setup-Wizard/Collect-from-Custom-Apps/Collect_Streaming_Data_from_HTTP).

## Running example

```bash
yarn # install dependencies
SUMO_ENDPOINT="http://path/to/collector/you/created" node index.js
```

Check your Sumo account for data in the collector you created. There are dummy metrics sent as well so view the Metrics section to see those values.
