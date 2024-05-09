
import getAllStatus from "../getAll.js";
import statusGateway from '../../../application/statusGateway.js';

const status = [{
  description: 'Received',
  createdAt: '2024-01-01 00:00',
  updatedAt: '2024-01-01 00:00',
}];

jest.mock('../../../application/statusGateway', () => ({
  __esModule: true,
  default: jest.fn().mockReturnValue({
    findAll: jest.fn().mockResolvedValue(status),
  }),
}));

describe('findAll use case', () => {
  it('should call findAll properly', async () => {
    const result = await getAllStatus();
    expect(statusGateway().findAll).toHaveBeenCalled();
    expect(result).toBe(status);
  });
});
