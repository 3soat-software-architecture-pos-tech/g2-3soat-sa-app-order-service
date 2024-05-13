import getProduct from "../../../api/services/product.js"
import useCaseProductById from "../getById.js"

jest.mock('../../../api/services/product.js', () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue(product),
}))

const product = {
	productId: 1,
	productQuantity: 10,
	productName: "Product 1",
}

describe("getProduct use case", () => {
	it('calls getProduct with the provided ID', () => {
		const productId = 123;
		useCaseProductById(productId);

		expect(getProduct).toHaveBeenCalledWith(productId);
	});
})
