Hawk.TextareaFormField = class extends Hawk.TextFormField {
	bind(form) {
		this.field = $(form).find('textarea[name="' + this.getName() + '"]');

		this.wrapper = this.options.obtainWrapper(this.field);

		return this.isBinded();
	}
}