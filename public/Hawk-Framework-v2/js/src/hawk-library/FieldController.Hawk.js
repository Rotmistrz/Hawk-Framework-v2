Hawk.FieldController = class {
	constructor(field, options) {
		this.defaultOptions = {
			onChange: function(field, value) {

			},

			onKeyDown: function(field, value) {

			}
		}

		this.field = $(field);

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	run() {
		var that = this;
		
		if (this.options.onChange !== this.defaultOptions.onChange) {
			this.field.change(function(e) {
				that.options.onChange($(this), $(this).val());
			});
		}
		
		if (this.options.onKeyDown !== this.defaultOptions.onKeyDown) {
			this.field.keydown(function(e) {
				setTimeout(function() {
					that.options.onChange($(this), $(this).val());
				}, 32);
			});
		}
	}
}