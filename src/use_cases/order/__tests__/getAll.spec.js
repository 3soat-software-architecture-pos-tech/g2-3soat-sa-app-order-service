
import getAllOrders from "../getAll.js";
import orderGateway from '../../../application/orderGateway.js';

const orders = [{
  orderNumber: 123456,
  customer: 'John Doe',
  totalOrderPrice: 100,
  orderStatus: 'Received',
  orderProductsDescription: 'Product 1, Product 2',
  createdAt: '2024-01-01 00:00',
  updatedAt: '2024-01-01 00:00',
}];

jest.mock('../../../application/orderGateway', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    findAll: jest.fn().mockResolvedValue(orders),
  }),
}));

describe('findAll use case', () => {
  it('should call findAll properly', async () => {
    const result = await getAllOrders();
    expect(orderGateway().findAll).toHaveBeenCalled();
    expect(result).toBe(orders);
  });
});
