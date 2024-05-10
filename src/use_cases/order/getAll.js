import orderGateway from "../../application/orderGateway.js";

const gateway = orderGateway();

export default function getAllOrders() {
	return gateway.findAll();
}