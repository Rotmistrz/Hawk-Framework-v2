Hawk.TextFormField = class extends Hawk.FormField {
	constructor(name, options) {
		super(name, options);
	}

	getValue() {
		return this.field.val();
	}

	validate() {
		return this.options.validate(this.getValue());
	}

	initializeObserving() {
		this.field.keydown(() => {
			setTimeout(() => {
				this.checkField();
			}, 10);
		});
	}
}