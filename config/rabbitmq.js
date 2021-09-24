const amqp = require('amqplib');
const { rabbitmqURL } = require('./config');

module.exports = amqp.connect(rabbitmqURL);
