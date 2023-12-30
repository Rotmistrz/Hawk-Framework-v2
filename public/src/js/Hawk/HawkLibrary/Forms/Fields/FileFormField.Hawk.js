Hawk.FileFormField = class extends Hawk.FormField {
	constructor(name, allowedTypes, options) {
		super(name, options);

		this.defaultOptions = Hawk.mergeWholeObjects(super.getDefaultOptions(), {
			onFileSelect: function(name, wrapper, fileExists) {},
			pathFieldClass: 'file-form-field__path',
			maxNamePreviewLength: 64
		});

		//console.log(this.defaultOptions);

		this.options = Hawk.mergeObjects(this.defaultOptions, options);

		this.allowedTypes = allowedTypes;
	}

	getValue() {
		return this.field.val();
	}

	getAllowedTypes() {
		return this.allowedTypes;
	}

	validate() {
		var val;

		var field = this.getField();
		var wrapper = this.getWrapper();

		var rawField = field.get(0);

		var id = parseInt(field.attr('data-id'));

		const pathContainer = wrapper.find('.' + this.options.pathFieldClass);

		if(field.val().length > 0) {
			val = field.val();
		} else {
			val = field.attr('placeholder');

			wrapper.removeClass('filled');

			pathContainer.html('');

			this.options.onFileSelect(field.name, wrapper, false);

			return false;
		}

		val = val.replace('fakepath\\', '');

		if (val.length > this.options.maxNamePreviewLength) {
			val = val.slice(-this.options.maxNamePreviewLength);
			val = "..." + val;
		}

		wrapper.addClass('filled');

		pathContainer.text(val);

		wrapper.removeClass('error');

		if(field.val().length > 0) {
			var fileType = field.get(0).files[0].type.valueOf();

			// if (typeof callback == 'function') {
			//     callback(field.name, id);
			// }

			var parent = field.parent();
			var removeField = parent.find('[name="' + name + '-remove"]');

			if (removeField.length > 0) {
				removeField.val(0);
			}

			if(Hawk.isInObject(fileType, this.getAllowedTypes())) {
				wrapper.removeClass('error');

				this.options.onFileSelect(field.name, wrapper, true);

				return true;
			} else {
				wrapper.addClass('error');

				this.options.onFileSelect(field.name, wrapper, true);

				return false;
			}
		} else {
			rawField.value = '';

			if(!/safari/i.test(navigator.userAgent)){
				rawField.type = ''
				rawField.type = 'file'
			}

			this.options.onFileSelect(field.name, wrapper, false);

			return false;
		}
	}

	initializeObserving() {
		this.field.change(() => {
			setTimeout(() => {
				this.checkField();
			}, 10);
		});
	}
}