
import findById from "../findById.js";
import statusGateway from '../../../application/statusGateway.js';

const status = {
	description: 'Received',
	createdAt: '2024-01-01 00:00',
	updatedAt: '2024-01-01 00:00',
};

jest.mock('../../../application/statusGateway', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		findById: jest.fn().mockResolvedValue(status),
	}),
}));

describe('findById use case', () => {
	it('should call findById properly', async () => {
		await findById(123456);
		expect(statusGateway().findById).toHaveBeenCalled();
	});
});
