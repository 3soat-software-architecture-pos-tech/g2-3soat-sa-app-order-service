// const { SQSClient, ReceiveMessageCommand, AWS } = require("@aws-sdk/client-sqs");
import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from "@aws-sdk/client-sqs";
import updateStatusById from "../../../controllers/orderController.js";
import AWS from 'aws-sdk';

const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/767397818445/fila-de-pagamentos';
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

export default async function receiveMessages() {
	try {
		const data = await sqsClient.send(new ReceiveMessageCommand(params));

		if (data.Messages) {
			data.Messages.forEach(message => {
				const orderToUpdate = message?.Body?.external_reference;

				if (orderToUpdate) {
					updateStatusById(orderToUpdate, 'payment_received')
					deleteMessage(message);
					receiveMessages();
				}
			});
		} else {
			console.log("No messages available");
			receiveMessages();
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
