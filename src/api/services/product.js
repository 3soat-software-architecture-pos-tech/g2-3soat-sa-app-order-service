import axiosClient from "../apiClient.js";

const baseURL = process.env.PRODUCT_API_URL;
const headers = {
	'Content-Type': 'application/json',
}

export const mockProductDetails = [
	{
		id: 1,
		productName: "Mock Product",
		categoryDescription: "Mock Product Description",
		price: 100,
		stock: 10,
		category: "Mock Category",
		image: "https://via.placeholder.com/150"
	},
	{
		id: 2,
		productName: "Mock Product",
		categoryDescription: "Mock Product Description",
		price: 100,
		stock: 10,
		category: "Mock Category",
		image: "https://via.placeholder.com/150"
	},
	{
		id: 3,
		productName: "Mock Product",
		categoryDescription: "Mock Product Description",
		price: 100,
		stock: 10,
		category: "Mock Category",
		image: "https://via.placeholder.com/150"
	}
]

export default async function getProduct(id) {
	try {
		return await axiosClient(baseURL, headers).get(`/${id}`);
	} catch (error) {
		console.log(`${error.message} - Using mockProductDetails`);
		return mockProductDetails.find(product => product.id.toString() === id);
	}
	// return await axiosClient(baseURL, headers).get(`/${id}`);
}
