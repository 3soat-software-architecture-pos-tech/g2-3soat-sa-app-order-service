import Order from "../../entities/Order.js";
import orderGateway from "../../application/orderGateway.js";

const gateway = orderGateway();

export default function updateById(
  id,
  orderNumber,
  customer,
  orderProducts, //array of products
  totalOrderPrice,
  orderStatus,
  updatedAt
) {
  if (!orderNumber || !customer || !orderProducts || !totalOrderPrice || !orderStatus) {
    return Promise.resolve('Order Number, Customer, Total Order Price and Order Status fields are mandatory');
  }
  const updatedOrder = new Order(
    orderNumber,
    customer,
    orderProducts, //array of products
    totalOrderPrice,
    orderStatus,
    updatedAt,
  );

  return gateway.findById(id).then((foundOrder) => {
    if (!foundOrder) {
      return Promise.resolve(`No order found with id: ${id}`);
    }
    return gateway.updateById(id, updatedOrder);
  });
}
