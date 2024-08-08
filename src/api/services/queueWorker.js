import orderController from "../../controllers/orderController.js";
import QUEUE_ACTION from "./enums.js";
import sqsNotificationReceive from "./sqsNotificationReceive.js";

const queueWorker = () => {
	sqsNotificationReceive(process.env.AWS_QUEUE_URL_PRODUTOS_RESERVADOS, orderController().updateOrderStatus, QUEUE_ACTION.PRODUTOS_RESERVADOS);
	sqsNotificationReceive(process.env.AWS_QUEUE_URL_SEM_ESTOQUE_PRODUTO, orderController().updateOrderStatus, QUEUE_ACTION.SEM_ESTOQUE_PRODUTO);
	sqsNotificationReceive(process.env.AWS_QUEUE_RESPONSE_PAYMENT, orderController().updateOrderStatus, QUEUE_ACTION.RECEIVED_FROM_PAYMENT);
	// receiveMessages();
}

export default queueWorker;