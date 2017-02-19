'use strict';

const awsIot = require('aws-iot-device-sdk');

// NOTE: other connection examples: https://github.com/aws/aws-iot-device-sdk-js/blob/master/examples/browser/mqtt-explorer/index.js
const IoT = () => {
  let _client;
  let _log = message => { console.log(message); };
  function _onConnect() {
    _log('Connected');
    this.onConnect();
  };

  return {
    connect: function (iotEndpoint, region, accessKey, secretKey, sessionToken) {
      _client = awsIot.device({
          region: region,
          protocol: 'wss',
          accessKeyId: accessKey,
          secretKey: secretKey,
          sessionToken: sessionToken,
          port: 443,
          host: iotEndpoint
      });

      let that = this;
      console.log('connecting client');
      _client.on('connect', _onConnect.bind(this));
      _client.on('message', that.onMessage);
      _client.on('error', that.onError);
      _client.on('reconnect', that.onReconnect);
      _client.on('offline', that.onOffline);
      _client.on('close', that.onClose);

    },
    send: (topic, message) => {
      _client.publish(topic, message);
    },
    subscribe: topic => {
      _client.subscribe(topic);
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
