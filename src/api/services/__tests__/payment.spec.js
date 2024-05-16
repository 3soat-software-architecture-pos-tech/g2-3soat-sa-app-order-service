import axiosClient from '../../apiClient.js';
import createNewPayment from '../payment.js';

jest.mock('../../apiClient.js', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		create: jest.fn().mockResolvedValue({
			post: jest.fn().mockResolvedValue({
				data: {
					qr_Code: 'mockQRData',
				}
			})
		}),
		post: jest.fn().mockResolvedValue({
			data: {
				qr_Code: 'mockQRData',
			}
		})
	})
}));

describe("create payment function", () => {
	it("fetches payment data from the API", async () => {
		const mockProductData = { data: { id: 1, name: "Product Name", price: 10.99 }};
		const paymentReturn = { data: { qr_Code: 'mockQRData' }};
		const payment = await createNewPayment(mockProductData);

		expect(axiosClient).toHaveBeenCalledWith('https://localhost:3000/api/payment', { Authorization: 'Bearer undefined', 'Content-Type': 'application/json'});
		expect(payment).toEqual(paymentReturn);
	});
});