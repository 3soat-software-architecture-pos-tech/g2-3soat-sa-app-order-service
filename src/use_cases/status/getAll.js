import statusGateway from "../../application/statusGateway.js";

const gateway = statusGateway();
export default async function getAllStatus() {
	return gateway.findAll();
}
