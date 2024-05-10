import statusGateway from "../../application/statusGateway.js";

const gateway = statusGateway();

export default async function findById(id) {
	return gateway.findById(id);
}
