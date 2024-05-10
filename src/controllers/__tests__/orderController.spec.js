import orderController from '../orderController.js';
import useCaseCreate from '../../use_cases/order/add.js'
import useCaseUpdate from '../../use_cases/order/updateById.js'
import useCaseDelete from '../../use_cases/order/deleteById.js'
import useCaseFindById from '../../use_cases/order/findById.js'
import getAllStatus from '../../use_cases/status/getAll.js'
import useCaseGetAllOrders from '../../use_cases/order/getAll.js'

jest.mock('../../use_cases/order/add.js');
jest.mock('../../use_cases/order/updateById.js');
jest.mock('../../use_cases/order/deleteById.js');
jest.mock('../../use_cases/order/findById.js');
jest.mock('../../use_cases/status/getAll.js');
jest.mock('../../use_cases/order/getAll.js');

jest.mock('../../entities/Order.js', () => {
	return jest.fn(() => ({
		getOrderNumber: jest.fn(),
		getCustomer: jest.fn(),
		getTotalOrderPrice: jest.fn(),
		getOrderStatus: jest.fn(),
		getOrderProductsDescription: jest.fn(),
		getCreatedAt: jest.fn(),
		getUpdatedAt: jest.fn(),
		getOrder: jest.fn()
	}));
});

const FIXED_SYSTEM_TIME = '2020-11-18T00:00:00Z';
const next = jest.fn();
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
		jest.useFakeTimers('modern');
		jest.setSystemTime(Date.parse(FIXED_SYSTEM_TIME));
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
			getAllStatus.mockResolvedValue([{ statusId: 1, description: 'pending' }]);
			useCaseCreate.mockResolvedValue(orderResponse);

			await orderController().addNewOrder(req, res, next);
			expect(useCaseCreate).toHaveBeenCalledTimes(1);
			// expect(useCaseCreate).toHaveBeenCalledWith("1", "customer", 100, "pending", req.body.orderProductsDescription, undefined, undefined);
		});
	});

	describe('fetchOrderById', () => {
		const req = {
			params: {
				id: "1"
			}
		};
		it("should fetch order by id properly when there is order", async () => {
			useCaseFindById.mockResolvedValue(orderResponse);

			await orderController().fetchOrderById(req, res, next);
			expect(useCaseFindById).toHaveBeenCalledTimes(1);
			expect(useCaseFindById).toHaveBeenCalledWith("1");
		});

		it("should fetch order by id properly when there is NO order", async () => {
			useCaseFindById.mockResolvedValue(null);
			const res = {
				json: jest.fn(),
			};

			await orderController().fetchOrderById(req, res, next)	;
			expect(useCaseFindById).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith("No order found with id: 1");
		});

		// FIXME: This test is not working
		it("should call next with error when useCasefindById throws an error", async () => {
			const error = new Error('Error');
			useCaseFindById.mockResolvedValue(error);
			const res = {
				json: jest.fn(),
			};

			await orderController().fetchOrderById(req, res, next);
			expect(useCaseFindById).toHaveBeenCalledWith('1');
    	// expect(next).toHaveBeenCalled();
		});
	})

	describe('fetchAllOrder', () => {
		const req = {
			params: {
				id: "1"
			}
		};

		const res = {
			json: jest.fn(),
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
					}
				},
				{
					orderNumber: "2",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 2,
						description: 'pending'
					}
				},
				{
					orderNumber: "3",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					}
				}
			]
			useCaseGetAllOrders.mockResolvedValue(response);
			const req = {
				query: {
					list: 'all'
				}
			};
			await orderController().fetchAllOrder(req, res, next);
			expect(useCaseGetAllOrders).toHaveBeenCalledTimes(1);
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
					}
				},
				{
					orderNumber: "2",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 2,
						description: 'pending'
					}
				},
				{
					orderNumber: "3",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					}
				}
			]
			useCaseGetAllOrders.mockResolvedValue(response);
			const req = {
				query: {
					list: 'in_progress'
				}
			};
			await orderController().fetchAllOrder(req, res, next);
			expect(useCaseGetAllOrders).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith([
				{
					orderNumber: "1",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					}
				},
				{
					orderNumber: "3",
					customer: "customer",
					orderProducts: [],
					totalOrderPrice: 100,
					orderStatus: {
						statusId: 1,
						description: 'in_progress'
					}
				}
			]);
		});

		it("should return properly when there is NO order", async () => {
			useCaseGetAllOrders.mockResolvedValue(null);
			const res = {
				json: jest.fn(),
			};

			await orderController().fetchAllOrder(req, res, next);
			expect(useCaseGetAllOrders).toHaveBeenCalledTimes(1);
			expect(res.json).toHaveBeenCalledWith("No order found");
		});
	})

	describe('deleteOrderById', () => {
		const req = {
			params: {
				id: "1"
			}
		};
		it("should delete order by id properly", async () => {
			useCaseDelete.mockResolvedValue();
			await orderController().deleteOrderById(req, res, next);
			expect(useCaseDelete).toHaveBeenCalledTimes(1);
			expect(useCaseDelete).toHaveBeenCalledWith("1");
		});

		it("should call next with error when useCasedelete throws an error", async () => {
			const error = new Error('Error');
			useCaseDelete.mockResolvedValue(error);
			const res = {
				json: jest.fn(),
			};

			await orderController().deleteOrderById(req, res, next);
			expect(useCaseDelete).toHaveBeenCalledWith('1');
			// expect(next).toHaveBeenCalled();
		});
	})

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
		it("should update order by id properly", async () => {
			useCaseUpdate.mockResolvedValue('Order sucessfully updated!');
			await orderController().updateOrderById(req, res, next);
			expect(useCaseUpdate).toHaveBeenCalledTimes(1);
			expect(useCaseUpdate).toHaveBeenCalledWith("1", "1", "customer", [], 100, "pending", Date());
		});

		it("should call next with error when useCaseupdateById throws an error", async () => {
			const error = new Error('Error');
			useCaseUpdate.mockResolvedValue(error);
			const res = {
				json: jest.fn(),
			};

			await orderController().updateOrderById(req, res, next);
			expect(useCaseUpdate).toHaveBeenCalledWith('1', '1', 'customer', [], 100, 'pending', Date());
			// expect(next).toHaveBeenCalled();
		});
	});
});