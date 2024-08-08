import sqsNotificationReceive from "../api/services/sqsNotificationReceive.js";
import sqsNotificationSend from "../api/services/sqsNotificationSend.js";

export default function sqsGateway() {
	const sendSQSNotification = (queueUrl, message) => sqsNotificationSend(queueUrl, message);
	const receiveSQSNotification = (queueUrl) => sqsNotificationReceive(queueUrl);

	return {
		sendSQSNotification,
		receiveSQSNotification
	};
}