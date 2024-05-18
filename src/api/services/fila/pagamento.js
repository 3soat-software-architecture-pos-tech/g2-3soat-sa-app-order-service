// const { SQSClient, ReceiveMessageCommand, AWS } = require("@aws-sdk/client-sqs");
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import AWS from 'aws-sdk';

const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/774598510677/fila-de-pedidos';
// Set up AWS credentials and region if not already configured
AWS.config.update({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY
	}
});

// Create SQS client
const sqsClient = new SQSClient({ region: process.env.AWS_REGION });

// Configure receiveMessage command parameters
const params = {
	QueueUrl: QUEUE_URL,
	MaxNumberOfMessages: 10 // Maximum number of messages to retrieve
};

// Function to receive and process messages
export default async function receiveMessages() {
	try {
		// Send receiveMessage command
		const data = await sqsClient.send(new ReceiveMessageCommand(params));

		// Process received messages
		if (data.Messages) {
			data.Messages.forEach(message => {
				console.log("Received message:", message.Body);

				// TODO: Process the message according to your application logic
				if (message.Body !== "No messages available") {
					console.log('Send to process payment ', message.Body);
					// const order = JSON.parse(message.Body);
					// Call the payment service to create a new payment
					// createNewPayment(order);
					if (message.Body === 'message 1') {
						deleteMessage(message.ReceiptHandle);
						console.log('approved');
					}
				}

				// Delete the message from the queue once processed
				// deleteMessage(message.ReceiptHandle);
			});
		} else {
			console.log("No messages available");
		}
	} catch (err) {
		console.error("Error receiving messages:", err);
	}
}

// Function to delete a message from the queue
export async function deleteMessage(receiptHandle) {
	try {
		const deleteParams = {
			QueueUrl: QUEUE_URL,
			ReceiptHandle: receiptHandle
		};
		const deleteCommand = new DeleteMessageCommand(deleteParams);
		await sqsClient.send(deleteCommand);
		console.log("Message deleted successfully");
		receiveMessages();
	} catch (err) {
		console.error("Error deleting message:", err);
	}
}
