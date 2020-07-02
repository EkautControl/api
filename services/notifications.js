const snsClient = require('../config/sns');

module.exports = () => {
  const notificationAgent = {};

  const snsTopicArn = process.env.SNS_TOPIC_ARN;

  notificationAgent.publish = (message) => {
    const params = {
      Message: message,
      TopicArn: snsTopicArn,
    };

    const publishPromise = snsClient.publish(params).promise();

    publishPromise.then((data) => {
      console.log(`Message ${params.Message} sent to the topic ${params.TopicArn}`);
      console.log(`MessageID is ${data.MessageId}`);
    }).catch((err) =>{
      console.error(err, err.stack);
    });
  };

  return notificationAgent;
};
