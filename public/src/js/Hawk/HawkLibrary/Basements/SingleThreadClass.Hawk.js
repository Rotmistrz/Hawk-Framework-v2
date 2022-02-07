Hawk.SingleThreadClass = class {
	constructor() {
		this.request = null;
		this.requestWorking = false;
	}

	setRequest(request) {
		this.request = request;
	
		return this;
	}

	getRequest() {
		return this.request;
	}

	clearRequest() {
		this.request = null;

		return this;
	}

	isWorking() {
		return this.requestWorking;
	}

	startWorking() {
		this.requestWorking = true;
	}

	finishWorking() {
		this.requestWorking = false;
	}
}