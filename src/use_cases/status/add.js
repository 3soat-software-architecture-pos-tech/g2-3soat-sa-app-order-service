import Status from "../../entities/Status.js";
import statusGateway from "../../application/statusGateway.js";

const gateway = statusGateway();

export default async function createStatus(
	description,
	statusName,
	createdAt,
	updatedAt
){
	if (!description) {
		return Promise.resolve(`Description fields cannot be empty`);
	}

	if (!statusName) {
		return Promise.resolve(`Status name fields cannot be empty`);
	}

	const newStatus = new Status({description, statusName, createdAt, updatedAt})
	return gateway.add(newStatus);
}
