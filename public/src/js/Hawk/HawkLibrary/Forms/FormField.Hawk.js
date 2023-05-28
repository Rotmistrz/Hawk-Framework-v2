Hawk.FormField = class {
	constructor(name, options) {
		this.name = name;
		this.field = null;
		this.wrapper = null;

		this.defaultOptions = {
			obtainWrapper: function(field) {
				return field.parents('.form-field');
			},
			required: true,
			validate: function(field) {
				return true;
			},
			errorClass: "error"
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	getField() {
		return this.field;
	}

	getName() {
		return this.name;
	}

	getWrapper() {
		return this.wrapper;
	}

	getValue() {
		throw new Error("This method should be overwritten in the subclass.");
	}

	validate() {
		throw new Error("This method should be overwritten in the subclass.");
	}

	clearValue() {
		throw new Error("This method should be overwritten in the subclass.");
	}

	bind(form) {
		this.field = $(form).find('input[name="' + this.getName() + '"], input[name="' + this.getName() + '[]"]');

		this.wrapper = this.options.obtainWrapper(this.field);

		return this.isBinded();
	}

	initializeObserving() {
		throw new Error("This method should be overwritten in the subclass.");
	}

	checkField() {
		if (this.validate()) {
			this.clear();
		} else {
			this.markAsIncorrect();
		}
	}

	isBinded() {
		return this.wrapper !== null && this.field !== null;
	}

	disable() {
		if (this.isBinded()) {
			this.field.attr('disabled', 'disabled');
		}

		return this;
	}

	markAsIncorrect() {
		this.wrapper.addClass(this.options.errorClass);

		return this;
	}

	clear() {
		this.wrapper.removeClass(this.options.errorClass);

		return this;
	}

	run(form) {
		this.bind(form);

		this.initializeObserving();
	}
}