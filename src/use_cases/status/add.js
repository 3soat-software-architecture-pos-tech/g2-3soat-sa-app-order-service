import status from "../../entities/Status.js";
import statusGateway from "../../application/statusGateway.js";

const gateway = statusGateway();

export default function createStatus(
  description,
  createdAt,
  updatedAt
){
  if (!description) {
    return Promise.resolve(`Description fields cannot be empty`);
  }
  const newStatus = status(description, createdAt, updatedAt)
  return gateway.add(newStatus);
}
