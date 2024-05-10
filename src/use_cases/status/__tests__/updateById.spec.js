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

describe('updateStatusById use case', () => {
	it('should call updateStatusById properly', async () => {
		await updateById(123456, 'status name', 'status description');
		expect(statusGateway().updateById).toHaveBeenCalled();
	});
});
