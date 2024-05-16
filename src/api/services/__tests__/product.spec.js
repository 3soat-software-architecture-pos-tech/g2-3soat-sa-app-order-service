import getProduct from '../product.js'; // Import the function you want to test
import axiosClient from '../../apiClient.js';

jest.mock('../../apiClient.js', () => ({
	__esModule: true,
	default: jest.fn().mockReturnValue({
		create: jest.fn().mockResolvedValue({
			get: jest.fn().mockResolvedValue({
				data: {
					id: 1,
					name: "Product Name",
					price: 10.99
				}
			})
		}),
		get: jest.fn().mockResolvedValue({
			data: {
				id: 1,
				name: "Product Name",
				price: 10.99
			}
		})
	})
}));


describe("getProduct function", () => {
	it("fetches product data from the API", async () => {
		const mockProductData = { data: { id: 1, name: "Product Name", price: 10.99 }}; // Mock product data
		const productId = 1;
		const product = await getProduct(productId);

		expect(axiosClient).toHaveBeenCalledWith(process.env.PRODUCT_API_URL, {
			'Content-Type': 'application/json'
		});
		expect(product).toEqual(mockProductData);
	});
});