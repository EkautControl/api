const openConn = require('../config/rabbitmq');
const controller = require('../api/controllers/temperature')();

const queue = 'temperature_queue';

openConn.then((connection) => connection.createChannel())
  .then((channel) => channel.assertQueue(queue)
    .then(() => channel.consume(queue, (msg) => {
      if (msg !== null) {
        controller.sensorTemperature(msg.content.toString());
        channel.ack(msg);
      }
    }, {
      noAck: false,
    })));
