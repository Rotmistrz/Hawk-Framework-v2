Hawk.StaticFormSender = class extends Hawk.FormSender {
	constructor(form, fields, callback, options) {
		super(form, fields, options);

		this.callback = callback;
	}

	send() {
		this.callback(this);
	}
}