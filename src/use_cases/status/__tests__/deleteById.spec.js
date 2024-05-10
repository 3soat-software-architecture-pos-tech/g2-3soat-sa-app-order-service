
import deleteById from "../deleteById.js";
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
		deleteById: jest.fn().mockResolvedValue(),
	}),
}));


describe('deleteById use case', () => {
	it('should return an error message if any of the required fields are empty', async () => {
		await deleteById(123456);
		expect(statusGateway().deleteById).toHaveBeenCalledWith(123456);
	});
});
