// const { SQSClient, ReceiveMessageCommand, AWS } = require("@aws-sdk/client-sqs");
import updateStatusById from "../../../controllers/orderController.js";
import AWS from 'aws-sdk';

// const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/767397818445/fila-de-pagamentos';
const QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/029390206697/teste-pagamento';
// Set up AWS credentials and region if not already configured
AWS.config.update({
	region: process.env.AWS_REGION,
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		sessionToken: process.env.AWS_SECTION_TOKEN,
	}
});

// Create SQS client
const sqs = new AWS.SQS();

// Configure receiveMessage command parameters
const params = {
	QueueUrl: QUEUE_URL,
	MaxNumberOfMessages: 10 // Maximum number of messages to retrieve
};

export default async function receiveMessages() {
	try {
		const data = await sqs.receiveMessage(params).promise();

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
		sqs.deleteMessage(deleteParams)
		console.log("Message deleted successfully");
		// receiveMessages();
	} catch (err) {
		console.error("Error deleting message:", err);
	}
}
