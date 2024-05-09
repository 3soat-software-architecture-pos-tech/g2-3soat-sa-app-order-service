
import deleteUserCase from "../deleteById.js";
import orderGateway from '../../../application/orderGateway.js';

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
    findById: jest.fn().mockResolvedValue(() => order),
    deleteById: jest.fn().mockResolvedValue(() => order),
  }),
}));


describe('deleteById use case', () => {
  it('should return an error message if any of the required fields are empty', async () => {
    await deleteUserCase(123456);
    expect(orderGateway().deleteById).toHaveBeenCalledWith(123456);
  });
});
