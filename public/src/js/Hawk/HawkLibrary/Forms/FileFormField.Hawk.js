Hawk.FileFormField = class extends Hawk.FormField {
	constructor(name, options) {
		super(name, options);
	}

	getValue() {
		return this.field.val();
	}

	validate() {
		return this.options.validate(this.getField());
	}

	initializeObserving() {
		this.field.change(() => {
			setTimeout(() => {
				this.checkField();
			}, 10);
		});
	}
}