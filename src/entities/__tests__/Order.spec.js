import Order from '../Order.js';
describe('Order Entity', () => {

	const orderObject = {
		orderNumber: 123456,
		customer: 'John Doe',
		totalOrderPrice: 100,
		orderStatus: 'Received',
		orderProductsDescription: 'Product 1, Product 2',
		createdAt: '2024-01-01 00:00',
		updatedAt: '2024-01-01 00:00',
	}

	it('should return each order entity attribute properly', () => {
		const order = new Order(orderObject);
		expect(order.getOrderNumber()).toBe(123456);
		expect(order.getCustomer()).toBe('John Doe');
		expect(order.getTotalOrderPrice()).toBe(100);
		expect(order.getOrderStatus()).toBe('Received');
		expect(order.getOrderProductsDescription()).toBe('Product 1, Product 2');
		expect(order.getCreatedAt()).toBe('2024-01-01 00:00');
		expect(order.getUpdatedAt()).toBe('2024-01-01 00:00');
		expect(order.getOrder()).toEqual({
			orderNumber: 123456,
			customer: 'John Doe',
			totalOrderPrice: 100,
			orderStatus: 'Received',
			orderProductsDescription: 'Product 1, Product 2',
			createdAt: '2024-01-01 00:00',
			updatedAt: '2024-01-01 00:00',
		});
	});
});
