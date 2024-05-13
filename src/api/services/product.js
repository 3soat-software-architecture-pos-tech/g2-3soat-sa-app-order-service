import axiosClient from "../apiClient.js";

const baseURL = process.env.PRODUCT_API_URL;
const headers = {
	'Content-Type': 'application/json',
}

export default async function getProduct(id) {
	return await axiosClient(baseURL, headers).get(`/${id}`);
}
