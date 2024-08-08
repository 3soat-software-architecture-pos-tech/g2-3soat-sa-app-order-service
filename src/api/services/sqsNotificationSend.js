import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid'

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
  	MessageDeduplicationId: uuidv4() // Gera um ID de deduplicação único,
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