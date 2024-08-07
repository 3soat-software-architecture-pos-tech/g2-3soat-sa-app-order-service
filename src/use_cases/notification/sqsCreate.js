import sqsGateway from "../../application/sqsGateway";
import Sqs from "../../entities/Sqs";

export default function sqsCreate(queueUrl, message) {
	// const sqsQueue = Sqs();
	sqsGateway().sendSQSNotification(queueUrl, message);
}