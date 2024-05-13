import statusController from '../statusController.js';
import useCaseCreate from '../../use_cases/status/add.js'
import useCasegetAll from '../../use_cases/status/getAll.js'
import useCaseFindById from '../../use_cases/status/findById.js';
import useCaseDelete from '../../use_cases/status/deleteById.js'
import useCaseUpdateById from '../../use_cases/status/updateById.js';

jest.mock('../../config/dbConnectMysql.js', () => ({
	beginTransaction: jest.fn(),
	query: jest.fn(),
	rollback: jest.fn(),
	commit: jest.fn(),
}));

jest.mock('../../use_cases/status/add.js');
jest.mock('../../use_cases/status/getAll.js');
jest.mock('../../use_cases/status/findById.js');
jest.mock('../../use_cases/status/deleteById.js');
jest.mock('../../use_cases/status/updateById.js');

const statusResponse = {
	id: "1",
	description: "pending",
	statusName: "pending",
	createdAt: "2024-03-09T17:30:47.000Z",
	updatedAt: "2024-03-09T17:30:47.000Z"
}

describe('Status Controller', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	describe('addNewStatus', () => {
		beforeEach(() => {
			jest.clearAllMocks();
		});

		const req = {
			body: {
				description: "pending"
			}
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		it('should add new status', async () => {
			useCaseCreate.mockResolvedValue(statusResponse);

			await statusController().addNewStatus(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(statusResponse);
		})

		it('should return error', async () => {
			useCaseCreate.mockRejectedValueOnce(new Error('Error'));

			await statusController().addNewStatus(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Status creation failed');
		})
	})

	describe('fetchStatusById', () => {
		const req = {
			params: {
				id: "1"
			}
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		it('should fetch status by id', async () => {
			useCaseFindById.mockResolvedValue(statusResponse);

			await statusController().fetchStatusById(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(statusResponse);
		})

		it('should return error when useCanFindById returns null', async () => {
			useCaseFindById.mockResolvedValue(null);

			await statusController().fetchStatusById(req, res);
			expect(res.status).toHaveBeenCalledWith(401);
			expect(res.json).toHaveBeenCalledWith('No status found with id: 1');
		})

		it('should return error', async () => {
			useCaseFindById.mockRejectedValueOnce(new Error('Error'));

			await statusController().fetchStatusById(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Status fetchStatusById failed');
		})
	});

	describe('fetchAllStatus', () => {
		const req = {};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};
		it('should fetch all status', async () => {
			useCasegetAll.mockResolvedValue([]);

			await statusController().fetchAllStatus(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith([]);
		})

		it('should return error', async () => {
			useCasegetAll.mockRejectedValueOnce(new Error('Error'));

			await statusController().fetchAllStatus(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Status fetchAllStatus failed');
		})
	});

	describe('deleteStatusById', () => {
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
		it('should delete status', async () => {
			useCaseDelete.mockResolvedValue(responseBody);

			await statusController().deleteStatusById(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(responseBody);
		});

		it('should return error', async () => {
			useCaseDelete.mockRejectedValueOnce(new Error('Error'));

			await statusController().deleteStatusById(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Status deleteStatusById failed');
		});
	});

	describe('updateStatusById', () => {
		const req = {
			params: {
				id: "1"
			},
			body: {
				description: "pendente",
				statusName: "pendente"
			}
		};
		const res = {
			status: jest.fn().mockReturnThis(),
			json: jest.fn()
		};

		const responseBody = {
			response: "Status Order updated",
			rowUpdate: 1,
			Description: "pendente"
		}
		it('should update status', async () => {
			useCaseUpdateById.mockResolvedValue(responseBody);

			await statusController().updateStatusById(req, res);
			expect(res.status).toHaveBeenCalledWith(200);
			expect(res.json).toHaveBeenCalledWith(responseBody);
		})

		it('should return error', async () => {
			useCaseUpdateById.mockRejectedValueOnce(new Error('Error'));

			await statusController().updateStatusById(req, res);
			expect(res.status).toHaveBeenCalledWith(400);
			expect(res.json).toHaveBeenCalledWith('Error - Status deleteStatusById failed');
		})
	})
});