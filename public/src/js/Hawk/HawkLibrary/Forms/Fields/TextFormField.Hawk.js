Hawk.TextFormField = class extends Hawk.FormField {
	constructor(name, options) {
		super(name, options);

		this.timeout = null;
	}

	getValue() {
		return this.field.val();
	}

	validate() {
		return this.options.validate(this.getValue());
	}

	clearValue() {
		this.field.val('');

		return this;
	}

	initializeObserving() {
		this.field.keydown(() => {
			if (this.timeout != null) {
				clearTimeout(this.timeout);
			}

			this.timeout = setTimeout(() => {
				this.checkField();
				this.timeout = null;
			}, 500);
		});

		this.field.change(() => {
			this.checkField();
		});
	}
}