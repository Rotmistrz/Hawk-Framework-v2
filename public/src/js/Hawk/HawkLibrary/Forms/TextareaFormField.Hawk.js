Hawk.TextareaFormField = class extends Hawk.FormField {
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

	bind(form) {
		this.field = $(form).find('textarea[name="' + this.getName() + '"]');

		this.wrapper = this.options.obtainWrapper(this.field);

		return this.isBinded();
	}
}