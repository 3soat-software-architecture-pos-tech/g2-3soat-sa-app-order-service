import updateById from "../updateById.js";
import orderGateway from '../../../application/orderGateway.js';

const orderStatus = {
  orderStatus: 1
}

const order = {
  orderNumber: 123456,
  customer: 'John Doe',
  totalOrderPrice: 100,
  orderStatus: 'Received',
  orderProductsDescription: 'Product 1, Product 2',
  createdAt: '2024-01-01 00:00',
  updatedAt: '2024-01-01 00:00',
};

jest.mock('../../../application/orderGateway', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    updateById: jest.fn().mockResolvedValue(),
    findById: jest.fn().mockResolvedValue(order),
  }),
}));

describe('updateById use case', () => {
  it('should call updateById properly', async () => {
    await updateById(1, order.orderNumber, order.customer, order.orderProductsDescription, order.totalOrderPrice, orderStatus, order.updatedAt);
    expect(orderGateway().updateById).toHaveBeenCalled();
  });
});
