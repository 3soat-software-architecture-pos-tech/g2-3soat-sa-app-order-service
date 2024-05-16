import axios from 'axios';
import axiosClient from '../apiClient.js';

// Mock axios.create function
jest.mock('axios');

describe('axiosClient', () => {
	const baseURL = 'https://api.example.com';
	const headers = {
		'Content-Type': 'application/json',
		'Authorization': 'Bearer your_access_token'
	};

	it('should create an Axios instance with provided baseURL and headers', () => {
		axiosClient(baseURL, headers);

		expect(axios.create).toHaveBeenCalledWith({
			baseURL: baseURL,
			headers: headers
		});
	});

	it('should return the created Axios instance', () => {
		const instance = axiosClient(baseURL, headers);

		expect(instance).toEqual(axios.create());
	});
});
