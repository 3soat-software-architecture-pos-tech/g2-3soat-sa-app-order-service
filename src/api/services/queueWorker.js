import orderController from "../../controllers/orderController.js";
import QUEUE_ACTION from "./enums.js";
import receiveMessages from "./fila/pagamento.js";
import sqsNotificationReceive from "./sqsNotificationReceive.js";

const queueWorker = () => {
	sqsNotificationReceive(process.env.AWS_QUEUE_URL_PRODUTOS_RESERVADOS, orderController().updateOrderStatus, QUEUE_ACTION.PRODUTOS_RESERVADOS);
	sqsNotificationReceive(process.env.AWS_QUEUE_URL_SEM_ESTOQUE_PRODUTO, undefined, QUEUE_ACTION.NOTIFICA_CLIENTE);
	sqsNotificationReceive(process.env.AWS_QUEUE_URL_RECEIVED_PAYMENT, orderController().sendToPay, QUEUE_ACTION.PROCEED_PAGAMENTO);
	receiveMessages();
}

export default queueWorker;