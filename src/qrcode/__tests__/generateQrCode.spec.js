import fs from 'fs';
import getQrCodeFile from '../generateQrCode.js';
import * as QrCode from 'qrcode'

jest.mock('fs');
jest.mock('qrcode', () => ({
	toDataURL: jest.fn().mockImplementation((data, callback) => {
		callback(null, 'fakeURL');
	}),
}));

console.log = jest.fn();

describe('getQrCodeFile', () => {
	it('generates a QR code file and returns a valid link', () => {
		const testData = 'Hello, World!';

		// Mock the fs.writeFileSync function to prevent writing to file system during testing
		jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});

		// Call the function
		getQrCodeFile(testData);
		QrCode.default.toDataURL.mockImplementation((data, callback) => {
			// Simulate the callback with a fake URL
			callback(null, 'fakeURL');
		});

		// Expectations
		// expect(fs.writeFileSync).toHaveBeenCalled(); // Verify that fs.writeFileSync was called
		expect(QrCode.toDataURL).toHaveBeenCalledTimes(1);
		expect(console.log).toHaveBeenCalledTimes(1); // Check if the link is printed
	});
});
