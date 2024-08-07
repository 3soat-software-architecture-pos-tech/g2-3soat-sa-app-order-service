import AWS from 'aws-sdk';
import sqsNotificationSend from './sqsNotificationSend.js';
import QUEUE_ACTION from './enums.js';

export default async function sqsNotificationReceive(queueUrl, persistFunctionCallback, action) {
	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: process.env.AWS_REGION,
		// sessionToken: process.env.AWS_SECTION_TOKEN,
	});
	const sqs = new AWS.SQS({});
	const params = {
		QueueUrl: queueUrl,
		// MessageGroupId: 'teste',
  	// MessageDeduplicationId: 'teste',
	};

	console.log('entrou no sqsNotificationReceive ', queueUrl);

	await sqs.receiveMessage(params).promise()
		.then((data) => {
			console.log(data);
			if (data.Messages.length) {
				console.log("Messages available in queue ");
				data.Messages.forEach(async (message) => {
					const messageBody = JSON.parse(message.Body);
					console.log("Message:", messageBody);
					if (persistFunctionCallback) {
						const result = await persistFunctionCallback(messageBody);
						console.log("Result:", result);
						if (result) {
							const deleteParams = {
								QueueUrl: queueUrl,
								ReceiptHandle: message.ReceiptHandle
							};
							// sqs.deleteMessage(deleteParams, (err, data) => {
							// 	if (err) {
							// 		console.error("Delete Error", err);
							// 	} else {
							// 		console.log("Message Deleted", data);
							// 		sqsNotificationReceive(queueUrl, persistFunctionCallback);
							// 	}
							// });
						} else {
							console.log("error on persisting order")
						}
					} else {
						if (action === QUEUE_ACTION.NOTIFICA_CLIENTE) {
							console.log("send action ", action);
							sqsNotificationSend(process.env.AWS_QUEUE_URL_NOTIFICA_CLIENTE, messageBody);
						}
					}

				});
				sqsNotificationReceive(queueUrl, persistFunctionCallback, action)
			} else {
				console.log("No messages available");
				sqsNotificationReceive(queueUrl, persistFunctionCallback, action)
			}
			// return data;
		})
		.catch((err) => {
			console.error("Error receiving messages:", err);
			return err;
		});
}