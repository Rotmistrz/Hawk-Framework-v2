Hawk.TextFormMultifield = class extends Hawk.FormMultifield {
    refreshFields(formSender) {
        const rawFields = formSender.form.find('input[data-field-name="' + this.getName() + '"]');

        this.fields = [];

        const that = this;

        rawFields.each(function() {
            let fieldRawName = that.getName() + "[" + $(this).attr('data-field-id') + "]";

            const dataSubfieldID = $(this).attr('data-subfield-id');

            if (typeof dataSubfieldID != 'undefined' && dataSubfieldID.length > 0) {
                fieldRawName += '[' + dataSubfieldID + ']';
            }

            const formField = new Hawk.TextFormField(fieldRawName, that.options);
            formField.run(formSender.form);

            that.fields.push(formField);
        });
    }
}