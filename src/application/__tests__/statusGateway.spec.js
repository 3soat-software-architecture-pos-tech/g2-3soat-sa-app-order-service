import statusRepositoryMySqlDB from "../../db/database/mySql/repositories/statusRepositoryMySqlDB.js";
import statusGateway from "../statusGateway.js";

jest.mock("../../db/database/mySql/repositories/statusRepositoryMySqlDB.js", () => ({
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

const id = 1;
const status = { id: 1, statusName: "pending", description: "description" };

describe("Status Gateway", () => {
	let gateway;
	const database = statusRepositoryMySqlDB();

	beforeEach(() => {
		gateway = statusGateway();
	});

	it('findById', () => {
		gateway.findById(id);

		expect(database.findById).toHaveBeenCalledTimes(1);
		expect(database.findById).toHaveBeenCalledWith(id);
	})

	it('add', () => {
		gateway.add(status);

		expect(database.add).toHaveBeenCalledTimes(1);
		expect(database.add).toHaveBeenCalledWith(status);
	})

	it('findAll', () => {
		gateway.findAll(id);

		expect(database.findAll).toHaveBeenCalledTimes(1);
	})

	it('updateById', () => {
		gateway.updateById(id, status);

		expect(database.updateById).toHaveBeenCalledTimes(1);
		expect(database.updateById).toHaveBeenCalledWith(id, status);
	})

	it('deleteById', () => {
		gateway.deleteById(id);

		expect(database.deleteById).toHaveBeenCalledTimes(1);
		expect(database.deleteById).toHaveBeenCalledWith(id);
	})
});