import AWS from 'aws-sdk';

export default function sqsNotificationSend(queueUrl, messageBody) {
	console.log('sqsNotificationSend queueUrl', queueUrl);
	console.log('sqsNotificationSend messageBody', messageBody);

	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: process.env.AWS_REGION,
		// sessionToken: process.env.AWS_SECTION_TOKEN,
	});


	const sqs = new AWS.SQS({});
	const params = {
		QueueUrl: queueUrl,
		MessageBody: messageBody,
		MessageGroupId: 'myGroup1',
  	MessageDeduplicationId: 'unique-message-id',
	};

	sqs.sendMessage(params, (err, data) => {
		if (err) {
			// eslint-disable-next-line no-console
			console.log("Error", err);
		} else {
			// eslint-disable-next-line no-console
			console.log("Message sent successfully", data.MessageId);
		}
	});
}