import updateStatusById from "../updateStatusById.js";
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
    updateStatusById: jest.fn().mockResolvedValue(),
    findById: jest.fn().mockResolvedValue(order),
  }),
}));

describe('updateStatusById use case', () => {
  it('should call updateStatusById properly', async () => {
    await updateStatusById(123456, orderStatus);
    expect(orderGateway().updateStatusById).toHaveBeenCalled();
  });
});
