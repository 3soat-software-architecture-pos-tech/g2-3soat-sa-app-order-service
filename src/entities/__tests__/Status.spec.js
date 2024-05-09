import Status from '../Status';
describe('Status Entity', () => {

  const statusObject = {
    description: 'Status received waiting for payment',
    statusName: 'Received',
    createdAt: '2024-01-01 00:00',
    updatedAt: '2024-01-01 00:00',
  };
  it('should return each status entity attribute properly', () => {
    const status = new Status(statusObject);
    expect(status.getDescription()).toBe('Status received waiting for payment');
    expect(status.getStatusName()).toBe('Received');
    expect(status.getCreatedAt()).toBe('2024-01-01 00:00');
    expect(status.getUpdatedAt()).toBe('2024-01-01 00:00');
    expect(status.getStatus()).toEqual({
      description: 'Status received waiting for payment',
      statusName: 'Received',
      createdAt: '2024-01-01 00:00',
      updatedAt: '2024-01-01 00:00',
    });
  });
});
