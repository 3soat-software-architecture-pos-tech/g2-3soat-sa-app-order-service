import orderGateway from "../../application/orderGateway.js";

const gateway = orderGateway();

export default async function deleteById(id) {
  return gateway.findById(id).then((order) => {
    if (!order || String(order) === 'null') {
      return Promise.resolve(`No order found with id: ${id}`);
    }
    return gateway.deleteById(id);
  });
}