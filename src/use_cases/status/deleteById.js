import statusGateway from "../../application/statusGateway.js";

const gateway = statusGateway();

export default async function deleteById(id) {
  return gateway.findById(id).then((status) => {
    if (!status || String(status) === 'null') {
      return Promise.resolve(`No status found with id: ${id}`);
    }
    return gateway.deleteById(id);
  });
}
