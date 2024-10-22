import TextFormField from "./TextFormField.Hawk";

export default class TextareaFormField extends TextFormField {
	bind(form) {
		this.field = $(form).find('textarea[name="' + this.getName() + '"]');

		this.wrapper = this.options.obtainWrapper(this.field);

		return this.isBinded();
	}
}