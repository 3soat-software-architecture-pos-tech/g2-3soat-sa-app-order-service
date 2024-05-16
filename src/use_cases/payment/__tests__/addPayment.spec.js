import createNewPayment from '../../../api/services/payment.js';
import getQrCodeFile from '../../../qrcode/generateQrCode.js';
import addPayment from '../addPayment.js';

// Mocking createNewPayment function
jest.mock('../../../api/services/payment', () => ({
	__esModule: true,
	default: jest.fn(),
}));

// Mocking getQrCodeFile function
jest.mock('../../../qrcode/generateQrCode', () => jest.fn());

describe('addPayment function', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should return "data can not be empty" if data is not provided', async () => {
		const result = await addPayment(null);
		expect(result).toBe('data can not be empty');
		expect(createNewPayment).not.toHaveBeenCalled();
		expect(getQrCodeFile).not.toHaveBeenCalled();
	});

	it('should call createNewPayment with provided data and generate QR code if qr_data is present in response', async () => {
		const mockResponse = {
			data: {
				qr_data: 'mockQRData',
			},
		};
		createNewPayment.mockResolvedValueOnce(mockResponse);
		await addPayment({ some: 'data' });

		expect(createNewPayment).toHaveBeenCalledWith({ some: 'data' });
		expect(getQrCodeFile).toHaveBeenCalledWith('mockQRData');
	});

	it('should return qr_data if qr_data is present in response', async () => {
		const mockResponse = {
			data: {
				qr_data: 'mockQRData',
			},
		};
		createNewPayment.mockResolvedValueOnce(mockResponse);
		const result = await addPayment({ some: 'data' });

		expect(result).toBe('mockQRData');
	});

	it('should return undefined if qr_data is not present in response', async () => {
		const mockResponse = {
			data: {},
		};
		createNewPayment.mockResolvedValueOnce(mockResponse);
		const result = await addPayment({ some: 'data' });

		expect(result).toBeUndefined();
	});
});
