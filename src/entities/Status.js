class Status {
	constructor(statusObject) {
		this.description = statusObject.description;
		this.statusName = statusObject.statusName;
		this.createdAt = statusObject.createdAt;
		this.updatedAt = statusObject.updatedAt;
	}

	getDescription() {
		return this.description;
	}

	getStatusName() {
		return this.statusName;
	}

	getCreatedAt() {
		return this.createdAt;
	}

	getUpdatedAt() {
		return this.updatedAt;
	}

	getStatus() {
		return { description: this.description, statusName: this.statusName, createdAt: this.createdAt, updatedAt: this.updatedAt };
	}
}

export default Status;