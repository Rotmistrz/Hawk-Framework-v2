Hawk.FieldController = class {
    constructor(fields, options) {
        this.defaultOptions = {
            onChange: function(field, value, allFields) {

            },

            onClick: function(field, allFields) {

            },

            onKeyDown: function(field, value, allFields) {

            }
        }

        this.fields = $(fields);

        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }

    run() {
        var that = this;

        if (this.options.onChange !== this.defaultOptions.onChange) {
            this.fields.change(function(e) {
                that.options.onChange($(this), $(this).val(), that.fields);
            });
        }

        if (this.options.onClick !== this.defaultOptions.onClick) {
            this.fields.click(function(e) {
                that.options.onClick($(this), that.fields);
            });
        }

        if (this.options.onKeyDown !== this.defaultOptions.onKeyDown) {
            this.fields.keydown(function(e) {
                setTimeout(function() {
                    that.options.onChange($(this), $(this).val(), that.fields);
                }, 32);
            });
        }
    }
}