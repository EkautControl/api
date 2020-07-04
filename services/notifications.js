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

  notificationAgent.unsubscribe = (subscriptionArn) => {
    const params = {
      SubscriptionArn: subscriptionArn,
    };
    const unsubscribePromise = snsClient.unsubscribe(params).promise();

    unsubscribePromise.then((data) => {
      console.log(data);
    }).catch((err) => {
      console.error(err);
    });
  };

  notificationAgent.subscribe = async (subscriptionData) => {
    const params = {
      Protocol: subscriptionData.notificationType,
      TopicArn: snsTopicArn,
      ReturnSubscriptionArn: true,
    };

    if (subscriptionData.notificationType === 'SMS') {
      params.Endpoint = subscriptionData.phone;
    } else {
      params.Endpoint = subscriptionData.email;
    }
    const subscriptionResponse = await snsClient.subscribe(params).promise();

    return subscriptionResponse;
  };

  return notificationAgent;
};
