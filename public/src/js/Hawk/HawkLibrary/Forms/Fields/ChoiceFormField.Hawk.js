import FormField from './FormField.Hawk';

export default class ChoiceFormField extends FormField {
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
			this.checkField();
		});
	}
}