import sqsGateway from "../../application/sqsGateway";
import Sqs from "../../entities/Sqs";

export default function sqsCreate() {
	const sqsQueue = Sqs();
	sqsGateway().receiveSQSNotification(sqsQueue.getMessage());
}