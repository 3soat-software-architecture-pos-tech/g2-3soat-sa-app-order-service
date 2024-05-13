import orderController from '../orderController.js';
import useCaseCreate from '../../use_cases/order/add.js'
import useCaseUpdate from '../../use_cases/order/updateById.js'
import useCaseDelete from '../../use_cases/order/deleteById.js'
import useCaseFindById from '../../use_cases/order/findById.js'
import getAllStatus from '../../use_cases/status/getAll.js'
import useCaseGetAllOrders from '../../use_cases/order/getAll.js'
import addPayment from '../../use_cases/payment/addMercadoPago.js';
import useCaseProductById from '../../use_cases/product/getById.js';

jest.mock('../../config/dbConnectMysql.js', () => ({
	beginTransaction: jest.fn(),
	query: jest.fn(),
	rollback: jest.fn(),
	commit: jest.fn(),
}));

jest.mock('../../use_cases/order/add.js');
jest.mock('../../use_cases/order/updateById.js');
jest.mock('../../use_cases/order/deleteById.js');
jest.mock('../../use_cases/order/findById.js');
jest.mock('../../use_cases/status/getAll.js');
jest.mock('../../use_cases/order/getAll.js');
jest.mock('../../use_cases/payment/addMercadoPago.js');
jest.mock('../../use_cases/product/getById.js');

const orderResponse = {
	orderNumber: "1",
	customer: "customer",
	orderProducts: [],
	totalOrderPrice: 100,
	orderStatus: "pending"
}
const res = {
	status: jest.fn().mockReturnThis(),
	json: jest.fn().mockReturnThis()
};
describe("Order Controller", () => {

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('addNewOrder' , () => {
		const req = {
			body: {
				orderNumber: "1",
				customer: "customer",
				orderProductsDescription: [
					{
						productId: 1,
						productQuantity: 2
					}
				]
			}
		};
		it("should add new order", async () => {
			addPayment.mockResolvedValue('qrcode_url');
			getAllStatus.mockResolvedValue([{ id: 1, description: 'pending' }]);
			useCaseProductById.mockResolvedValue({ price: 55, productName: 'product' });
			useCaseCreate.mockResolvedValue(orderResponse);

			await orderController().addNewOrder(req, res);
			expect(useCaseCreate).toHaveBeenCalledTimes(1);
			expect(useCaseCreate).toHaveBeenCalledWith("1", "customer", 110, 1, [{"productId": 1, "productQuantity": 2}], expect.any(String), expect.any(String));
			expect(addPayment).toHaveBeenCalledTimes(1);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith({ order: orderResponse, qrcode: 'qrcode_url'});
		});

		it("should not add new order when product information is not found", async () => {
			addPayment.mockResolvedValue('qrcode_url');
			getAllStatus.mockResolvedValue([{ id: 2, description: 'payment_required' }]);
			useCaseProductById.mockRejectedValueOnce(new Error('Error'));

			await orderController().addNewOrder(req, res);
			expect(useCaseCreate).not.toHaveBeenCalled();
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith("Product not found Error");
		});

		it("should handle error", async () => {
			useCaseCreate.mockRejectedValueOnce(new Error('Error'));

			await orderController().addNewOrder(req, res)	;
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Order creation failed');
		});
	});

	describe('fetchOrderById', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
		const req = {
			params: {
				id: "1"
			}
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};

		it("should fetch order by id properly when there is order", async () => {
			useCaseFindById.mockResolvedValue(orderResponse);

			await orderController().fetchOrderById(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(orderResponse);
		});

		it("should fetch order by id properly when no result", async () => {
			useCaseFindById.mockResolvedValue(null);

			await orderController().fetchOrderById(req, res)	;
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith('No order found with id: 1');
		});

		it("should fetch order by id properly when throws an error", async () => {
			useCaseFindById.mockRejectedValueOnce(new Error('Error'));

			await orderController().fetchOrderById(req, res)	;
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Order fetchOrderById failed');
		});
	})

	describe('fetchAllOrder', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		const req = {
			query: {
				list: 'all'
			}
		};

		it("should fetch all orders properly", async () => {
			const response = [
				{
					orderNumber: "1",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "2",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 2,
						description: 'pending'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "3",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					},
					createdAt: '2024-01-01 00:00',
				}
			]
			useCaseGetAllOrders.mockResolvedValue(response);
			await orderController().fetchAllOrder(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(response);
		});

		it("should fetch all in_progress orders properly", async () => {
			const response = [
				{
					orderNumber: "1",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "2",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 2,
						description: 'pending'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "3",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "4",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'done'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "5",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'received'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "6",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'done'
					},
					createdAt: '2024-01-01 02:00',
				},
				{
					orderNumber: "7",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'received'
					},
					createdAt: '2024-01-01 02:00',
				},
			]
			useCaseGetAllOrders.mockResolvedValue(response);
			const req = {
				query: {
					list: 'in_progress'
				}
			};
			await orderController().fetchAllOrder(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith([
				{
					orderNumber: "4",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'done'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "6",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'done'
					},
					createdAt: '2024-01-01 02:00',
				},
				{
					orderNumber: "1",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "3",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "5",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'received'
					},
					createdAt: '2024-01-01 00:00',
				},
				{
					orderNumber: "7",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'received'
					},
					createdAt: '2024-01-01 02:00',
				},
			]);
		});

		it("should return properly when there is NO order", async () => {
			useCaseGetAllOrders.mockResolvedValue(null);
			await orderController().fetchAllOrder(req, res);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith('No orders found');
		});

		it("should fetch order by id properly when throws an error", async () => {
			useCaseGetAllOrders.mockRejectedValueOnce(new Error('Error'));

			await orderController().fetchAllOrder(req, res)	;
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Order fetchAllOrder failed');
		});
	})

	describe('deleteOrderById', () => {
		const req = {
			params: {
				id: "1"
			}
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};

		const responseBody = {
			fieldCount: 0,
			affectedRows: 1,
			insertId: 0,
			info: '',
			serverStatus: 3,
			warningStatus: 0,
			changedRows: 0
		}
		it("should delete order by id properly", async () => {
			useCaseDelete.mockResolvedValue(responseBody);

			await orderController().deleteOrderById(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith('Order sucessfully deleted!');
		});

		it("should return error", async () => {
			useCaseDelete.mockRejectedValueOnce(new Error('Error'));

			await orderController().deleteOrderById(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Status deleteStatusById failed');
		});
	});

	describe('updateOrderById', () => {
		const req = {
			params: {
				id: "1"
			},
			body: {
				orderNumber: "1",
				customer: "customer",
				orderProducts: [],
				totalOrderPrice: 100,
				orderStatus: "pending"
			}
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		it("should update order by id properly", async () => {
			useCaseUpdate.mockResolvedValue('Order sucessfully updated!');
			await orderController().updateOrderById(req, res);

			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith('Order sucessfully updated!');
		});

		it("should return error", async () => {
			useCaseUpdate.mockRejectedValueOnce(new Error('Error'));

			await orderController().updateOrderById(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Status deleteStatusById failed');
		});
	});
});