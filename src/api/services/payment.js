import axiosClient from "../apiClient.js";

const baseURL = `http://localhost:3000/api/payment`;
const headers = {
	'Content-Type': 'application/json',
	'Authorization': `Bearer ${process.env.TOKEN_VENDEDOR_MP}`
}

export default function createNewPayment(data) {
	return axiosClient(baseURL, headers).post('/', JSON.stringify(data));
}
