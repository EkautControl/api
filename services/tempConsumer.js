const openConn = require('../config/rabbitmq');

const queue = 'temperature_queue';

openConn.then((connection) => connection.createChannel())
  .then((channel) => channel.assertQueue(queue)
    .then(() => channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(msg.content.toString());
        channel.ack(msg);
      }
    }, {
      noAck: false,
    })));
