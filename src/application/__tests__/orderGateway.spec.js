import orderRepositoryMySqlDB from "../../db/database/mySql/repositories/orderRepositoryMySqlDB.js";
import orderGateway from "../orderGateway.js";

jest.mock("../../db/database/mySql/repositories/orderRepositoryMySqlDB", () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		findById: jest.fn(),
		add: jest.fn(),
		findAll: jest.fn(),
		updateById: jest.fn(),
		deleteById: jest.fn(),
		updateStatusById: jest.fn(),
	}),
}));

const order = { orderNumber: "1", customer: "customer", totalOrderPrice: 100, orderStatus: "pending", orderProductsDescription: [] };
const id = 1;

describe("Order Gateway", () => {
	let gateway;
	const database = orderRepositoryMySqlDB();

	beforeEach(() => {
		gateway = orderGateway();
	});

	it('findById', () => {
		gateway.findById(id);

		expect(database.findById).toHaveBeenCalledTimes(1);
		expect(database.findById).toHaveBeenCalledWith(id);
	})

	it('add', () => {
		gateway.add(order);

		expect(database.add).toHaveBeenCalledTimes(1);
		expect(database.add).toHaveBeenCalledWith(order);
	})

	it('findAll', () => {
		gateway.findAll(id);

		expect(database.findAll).toHaveBeenCalledTimes(1);
	})

	it('updateById', () => {
		gateway.updateById(id, order);

		expect(database.updateById).toHaveBeenCalledTimes(1);
		expect(database.updateById).toHaveBeenCalledWith(id, order);
	})

	it('deleteById', () => {
		gateway.deleteById(id);

		expect(database.deleteById).toHaveBeenCalledTimes(1);
		expect(database.deleteById).toHaveBeenCalledWith(id);
	})

	it('updateStatusById', () => {
		const statusOrder = {
			orderStatus: "pending",
			id: 1
		};
		gateway.updateStatusById(id, statusOrder);

		expect(database.updateStatusById).toHaveBeenCalledTimes(1);
		expect(database.updateStatusById).toHaveBeenCalledWith(id, statusOrder);
	})
});