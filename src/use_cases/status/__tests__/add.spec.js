
import createStatus from "../add.js";

const status = {
	description: 'Received',
	createdAt: '2024-01-01 00:00',
	updatedAt: '2024-01-01 00:00',
};

jest.mock('../../../application/statusGateway', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		add: jest.fn().mockResolvedValue(status),
	}),
}));

describe('createStatus use case', () => {
	it('should create status properly', async () => {
		const result = await createStatus('Received', '2024-01-01 00:00', '2024-01-01 00:00');
		expect(result).toBe(status);
	});

	it('should return an error message if any of the required fields are empty', async () => {
		const result = await createStatus();
		expect(result).toBe('Description fields cannot be empty');
	});
});
