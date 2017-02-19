'use strict';

const awsIot = require('aws-iot-device-sdk');

// NOTE: other connection examples: https://github.com/aws/aws-iot-device-sdk-js/blob/master/examples/browser/mqtt-explorer/index.js
const IoT = () => {
  let _client, _iotTopic;
  let _log = message => { console.log(message); };
  function _onConnect() {
    _client.subscribe(iotTopic);
    _log('Connected');
    this.onConnect();
  };

  return {
    connect: (topic, iotEndpoint, region, accessKey, secretKey, sessionToken) => {
      _iotTopic = topic;
      _client = awsIot.device({
          region: region,
          protocol: 'wss',
          accessKeyId: accessKey,
          secretKey: secretKey,
          sessionToken: sessionToken,
          port: 443,
          host: iotEndpoint
      });

      _client.on('connect', _onConnect.bind(this));
      _client.on('message', this.onMessage);
      _client.on('error', this.onError);
      _client.on('reconnect', this.onReconnect);
      _client.on('offline', this.onOffline);
      _client.on('close', this.onClose);
    },
    send: (message) => {
      _client.publish(_iotTopic, message);
    },
    onConnect: () => {},
    onMessage: (topic, message) => {
      _log(message);
    },
    onError: () => {},
    onReconnect: () => {},
    onOffline: () => {},
    onClose: () => {
      _log('Connection failed');
    }
  };
};
window.IoT = IoT();
