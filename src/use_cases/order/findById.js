import orderGateway from "../../application/orderGateway.js";

const gateway = orderGateway();

export default async function findById(id) {
	return gateway.findById(id);
}
