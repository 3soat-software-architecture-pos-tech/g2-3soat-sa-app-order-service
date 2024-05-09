
import createOrder from "../add.js";

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
    add: jest.fn().mockResolvedValue(order),
  }),
}));

describe('createOrder use case', () => {
  it('should create order properly', async () => {
    const result = await createOrder(123456, 'John Doe', 100, 'Received', 'Product 1, Product 2', '2024-01-01 00:00', '2024-01-01 00:00');
    expect(result).toBe(order);
  });

  it('should return an error message if any of the required fields are empty', async () => {
    const result = await createOrder();
    expect(result).toBe('Order Number, Customer, Total Order Price and Order Status fields cannot be empty');
  });
});
