import statusGateway from "../../application/statusGateway.js";

const gateway = statusGateway();
export default function getAllStatus() {
	return gateway.findAll();
}
