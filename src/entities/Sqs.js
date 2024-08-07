export default function Sqs(message) {
	return {
		getMessage: () => message,
		sendMessage: () => message
	}
}
