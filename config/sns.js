const SNS = require('aws-sdk/clients/sns');

module.exports = new SNS({ region: 'us-east-2' });
