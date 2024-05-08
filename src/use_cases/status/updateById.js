import status from "../../entities/Status.js";
import statusGateway from "../../application/statusGateway.js";

const gateway = statusGateway();

export default async function updateById(
  id,
  statusName,
  description,
  //createAt,
  updatedAt
) {
  if (!statusName || !description) {
    return Promise.resolve('Status name and Description fields are mandatory');
  }
  const updatedStatus = status(
    statusName,
    description,
    updatedAt
  );

  return gateway.findById(id).then((foundStatus) => {
    if (!foundStatus) {
      return Promise.resolve(`No status found with id: ${id}`);
    }
    return gateway.updateById(id, updatedStatus);
  });
}
