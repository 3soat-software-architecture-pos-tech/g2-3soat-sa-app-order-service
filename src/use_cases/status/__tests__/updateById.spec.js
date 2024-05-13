import updateById from "../updateById.js";
import statusGateway from '../../../application/statusGateway.js';

const status = {
	description: 'Received',
	statusName: 'Status name',
	createdAt: '2024-01-01 00:00',
	updatedAt: '2024-01-01 00:00',
};

jest.mock('../../../application/statusGateway', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		findById: jest.fn().mockResolvedValue(status),
		updateById: jest.fn().mockResolvedValue(),
	}),
}));

const findById = statusGateway().findById;

describe('updateStatusById use case', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});
	it('should call updateStatusById properly', async () => {
		await updateById(123456, 'status name', 'status description');
		expect(statusGateway().updateById).toHaveBeenCalled();
	});

	it.each([
		[null, 'status description'],
		['status name', null],
		[null, null],
	])('should not update when there is not status name or status description mandatory fields', async (statusName, statusDescription) => {
		await updateById(123456, statusName, statusDescription);
		expect(statusGateway().updateById).not.toHaveBeenCalled();
	});

	it('should thrown error when status not found', async () => {
		findById.mockResolvedValue(null);

		const result = await updateById(123456, 'status name', 'status description');
		expect(result).toBe('No status found with id: 123456')
		expect(statusGateway().updateById).not.toHaveBeenCalled();
	});
});
