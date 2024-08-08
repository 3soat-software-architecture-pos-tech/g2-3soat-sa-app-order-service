import AWS from 'aws-sdk';
import sqsNotificationSend from './sqsNotificationSend.js';
import QUEUE_ACTION from './enums.js';
import { STATUS } from '../../controllers/statusController.js';
import orderController from '../../controllers/orderController.js';

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
	};

	console.log('sqsNotificationReceive ', queueUrl);

	await sqs.receiveMessage(params).promise()
		.then((data) => {
			if (data.Messages.length) {
				console.log("Messages available in queue ");

				data.Messages.forEach(async (message) => {
					const receiptHandle = message.ReceiptHandle;
					const messageBody = JSON.parse(message.Body);
					console.log("Message:", messageBody);

					if(action === QUEUE_ACTION.PRODUTOS_RESERVADOS){
						console.log(`action ${action}`);
						const message = {
							id: messageBody.idorder,
							statusOrder: STATUS.PAYMENT_REQUIRED
						}
						persistFunctionCallback(message);
						orderController().sendToPay(message)

						const deleteParams = {
							QueueUrl: queueUrl,
							ReceiptHandle: receiptHandle
						};
						deleteMessage(deleteParams);
					}
					// handle fila sem estoque: altera o status do pedido + notifica cliente
					if(action === QUEUE_ACTION.SEM_ESTOQUE_PRODUTO){
						console.log(`action ${action}`);
						const message = {
							id: messageBody.idorder,
							statusOrder: STATUS.CANCELED,
						}
						const order = await orderController().getOrder(message.id);

						persistFunctionCallback(message);
						sqsNotificationSend(process.env.AWS_QUEUE_URL_NOTIFICA_CLIENTE, JSON.stringify({ ...message, customer: order[0].customer_id }));

						const deleteParams = {
							QueueUrl: queueUrl,
							ReceiptHandle: receiptHandle
						};
						deleteMessage(deleteParams);
					}
					if(action === QUEUE_ACTION.RECEIVED_FROM_PAYMENT){
						console.log(`action ${action}`);
						const orderToUpdate = messageBody?.external_reference //messageBody?.Body?.external_reference; // ver esse formato
						const message = {
							id: orderToUpdate,
							statusOrder: STATUS.IN_PROGRESS,
						}
						persistFunctionCallback(message);
						const order = await orderController().getOrder(message.id);
						sqsNotificationSend(process.env.AWS_QUEUE_URL_NOTIFICA_CLIENTE, JSON.stringify({ ...message, customer: order[0].customer_id }));

						const deleteParams = {
							QueueUrl: queueUrl,
							ReceiptHandle: receiptHandle
						};
						deleteMessage(deleteParams);
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

const deleteMessage = async (deleteParams) => {
	console.log("deleteParams", deleteParams);

	AWS.config.update({
		accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		secretAccessKey: process.env.AWS_SECRET_KEY,
		region: process.env.AWS_REGION,
		// sessionToken: process.env.AWS_SECTION_TOKEN,
	});
	const sqs = new AWS.SQS({});
	sqs.deleteMessage(deleteParams, (err, data) => {
		if (err) {
			console.error("Delete Error", err);
		} else {
			console.log("Message Deleted", data);
		}
	});
}