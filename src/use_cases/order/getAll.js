import orderGateway from "../../application/orderGateway.js";

const gateway = orderGateway();

export default async function getAllOrders() {
	return gateway.findAll();
}