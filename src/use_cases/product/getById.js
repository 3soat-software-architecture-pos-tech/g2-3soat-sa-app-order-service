import getProduct from "../../api/services/product.js"

export default function useCaseProductById(id) {
	return getProduct(id)
}
