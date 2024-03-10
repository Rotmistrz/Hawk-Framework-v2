import FormSender from "./FormSender.Hawk";

export default class StaticFormSender extends FormSender {
	constructor(form, fields, callback, options) {
		super(form, fields, options);

		this.callback = callback;
	}

	send() {
		this.callback(this);
	}
}