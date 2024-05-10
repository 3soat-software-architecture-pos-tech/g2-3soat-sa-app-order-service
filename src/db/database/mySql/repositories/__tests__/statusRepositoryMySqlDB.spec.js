import connectDatabaseMySql from "../../../../../config/dbConnectMysql.js";
import statusRepositoryMySqlDB from '../statusRepositoryMySqlDB.js';

jest.mock('../../../../../config/dbConnectMysql.js', () => ({
	beginTransaction: jest.fn(),
	query: jest.fn(),
	rollback: jest.fn(),
	commit: jest.fn(),
}))

const database = statusRepositoryMySqlDB();

const status = {
	getDescription: jest.fn(() => 'Status description'),
	getStatusName: jest.fn(() => 'received'),
};

const statusResponse = [{
	id: 1,
	statusName: 'received',
	description: 'Status received',
}]

describe('Status Repository', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});
	describe('add', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should add a new status order to the database', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, { insertId: 1 }));
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback());

			await database.add(status);

			expect(connectDatabaseMySql.query).toHaveBeenCalledTimes(1);
			expect(connectDatabaseMySql.commit).toHaveBeenCalled();
		});

		it('should handle beginTransaction errors', async () => {
			const beginError = new Error('Transaction Error');
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(beginError));

			await expect(database.add(status)).rejects.toThrow(beginError);
		});

		it('should rollback the transaction if there is an error on insertQuery', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(null));
			connectDatabaseMySql.query.mockImplementation((query, values, callback) => {
				if (query.includes('INSERT INTO statusorder')) {
					callback(new Error('Status insertion error'));
				}
			});
			connectDatabaseMySql.rollback.mockImplementation((callback) => callback(null));

			await expect(database.add(status)).rejects.toThrow('Status insertion error');
		});

		it('should rollback the transaction if there is an commitError', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(null));
			connectDatabaseMySql.query.mockImplementation((query, values, callback) => {
				if (query.includes('INSERT INTO statusorder')) {
					callback(null, { insertId: 1 });
				}
			});
			connectDatabaseMySql.commit.mockImplementation((callback) => callback(new Error('Commit error')));
			connectDatabaseMySql.rollback.mockImplementation((callback) => callback(null));

			await expect(database.add(status)).rejects.toThrow('Commit error');
		});
	});

	describe('findAll', () => {
		it('should find all status to the database', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, callback) => callback(null, statusResponse));
			connectDatabaseMySql.query.mockImplementationOnce((query, callback) => callback(null));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback());

			const result = await database.findAll();

			expect(connectDatabaseMySql.query).toHaveBeenCalledTimes(1);
			expect(connectDatabaseMySql.commit).toHaveBeenCalled();
			expect(result).toEqual(statusResponse);
		});

		it('should handle beginTransaction errors', async () => {
			const beginError = new Error('Transaction Error');
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(beginError));

			await expect(database.findAll()).rejects.toThrow(beginError);
		});

		it('should rollback the transaction if there is an error on find query', async () => {
			const error = new Error('Error');

			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, callback) => callback(error, {}));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback(error));
			connectDatabaseMySql.rollback.mockImplementationOnce(callback => callback(error));


			let errorResult;
			try {
				await database.findAll();
			} catch (error) {
				errorResult = error;
			}
			expect(errorResult).toBeInstanceOf(Error);
			expect(connectDatabaseMySql.rollback).toHaveBeenCalled();
		});

		it('should rollback the transaction if there is an commitError', async () => {
			const error = new Error('Error');

			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, callback) => callback(null, {}));
			connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback(error));
			connectDatabaseMySql.rollback.mockImplementationOnce(callback => callback(error));

			let errorResult;
			try {
				await database.findAll();
			} catch (error) {
				errorResult = error;
			}

			expect(errorResult).toBeInstanceOf(Error);
			expect(connectDatabaseMySql.rollback).toHaveBeenCalled();
		});
	});

	describe('findById', () => {
		const id = 1;

		beforeEach(() => {
			jest.clearAllMocks();
		});

		it('should find status order by id', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, {}));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback());
			const result = await database.findById(id);

			expect(result).toEqual({});
		});

		it('should handle beginTransaction errors', async () => {
			const beginError = new Error('Transaction Error');
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(beginError));

			await expect(database.findById(id)).rejects.toThrow(beginError);
		});

		it('should rollback the transaction if there is an error on find query', async () => {
			const error = new Error('Error');

			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(error));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback(error));
			connectDatabaseMySql.rollback.mockImplementationOnce(callback => callback(error));

			let errorResult;
			try {
				await database.findById(id);
			} catch (error) {
				errorResult = error;
			}
			expect(errorResult).toBeInstanceOf(Error);
			expect(connectDatabaseMySql.rollback).toHaveBeenCalled();
		});

		it('should rollback the transaction if there is an commitError', async () => {
			const error = new Error('Error');

			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, {}));
			connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback(error));
			connectDatabaseMySql.rollback.mockImplementationOnce(callback => callback(error));

			let errorResult;
			try {
				await database.findById(id);
			} catch (error) {
				errorResult = error;
			}

			expect(errorResult).toBeInstanceOf(Error);
			expect(connectDatabaseMySql.rollback).toHaveBeenCalled();
		});
	});

	describe('deleteById', () => {
		const orderRepo = database;
		const id = 1;

		it('should delete status order by id', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, {}));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback());
			const result = await orderRepo.deleteById(id);

			expect(result).toEqual({});
		});

		it('should handle beginTransaction errors', async () => {
			const beginError = new Error('Transaction Error');
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(beginError));

			await expect(orderRepo.deleteById(id)).rejects.toThrow(beginError);
		});

		it('should rollback the transaction if there is an error on delete query', async () => {
			const error = new Error('Error');

			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(error));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback(error));
			connectDatabaseMySql.rollback.mockImplementationOnce(callback => callback(error));

			let errorResult;
			try {
				await orderRepo.deleteById(id);
			} catch (error) {
				errorResult = error;
			}
			expect(errorResult).toBeInstanceOf(Error);
			expect(connectDatabaseMySql.rollback).toHaveBeenCalled();
		});

		it('should rollback the transaction if there is an commitError', async () => {
			const error = new Error('Error');

			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, {}));
			connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback(error));
			connectDatabaseMySql.rollback.mockImplementationOnce(callback => callback(error));

			let errorResult;
			try {
				await orderRepo.deleteById(id);
			} catch (error) {
				errorResult = error;
			}

			expect(errorResult).toBeInstanceOf(Error);
			expect(connectDatabaseMySql.rollback).toHaveBeenCalled();
		});
	});

	describe('updateById', () => {
		const id = 1;
		const updateResult = {
			rowUpdate: 1,
			response: 'Status Order updated',
			Description: 'Status description',
		}

		it('should update status order by id', async () => {
			const statusLocal = {
				getDescription: jest.fn(() => 'Status description'),
				getStatusName: jest.fn(() => 'received'),
			};
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, { affectedRows: 1 }));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback());
			const result = await database.updateById(id, statusLocal);

			expect(result).toEqual(updateResult);
		});

		it('should not update status order by id', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, { affectedRows: 0 }));
			connectDatabaseMySql.commit.mockImplementation((callback) => callback());
			const result = await database.updateById(id, status);

			expect(result).toEqual({ retorno: 'Status Order not found', rowUpdate: 0 });
		});

		it('should handle beginTransaction errors', async () => {
			const beginError = new Error('Transaction Error');
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(beginError));

			await expect(database.updateById(id, status)).rejects.toThrow(beginError);
		});

		it('should rollback the transaction if there is an error on insertQuery', async () => {
			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback(null));
			connectDatabaseMySql.query.mockImplementation((query, values, callback) => {
				if (query.includes('UPDATE statusorder')) {
					callback(new Error('Status update error'));
				}
			});
			connectDatabaseMySql.rollback.mockImplementation((callback) => callback(null));

			await expect(database.updateById(id, status)).rejects.toThrow('Status update error');
		});

		it('should rollback the transaction if there is an commitError', async () => {
			const error = new Error('Error');

			connectDatabaseMySql.beginTransaction.mockImplementation((callback) => callback());
			connectDatabaseMySql.query.mockImplementationOnce((query, values, callback) => callback(null, {}));
			connectDatabaseMySql.commit.mockImplementationOnce((callback) => callback(error));
			connectDatabaseMySql.rollback.mockImplementationOnce(callback => callback(error));

			let errorResult;
			try {
				await database.updateById(id, status);
			} catch (error) {
				errorResult = error;
			}

			expect(errorResult).toBeInstanceOf(Error);
		});
	});
});
