Hawk.FormMultifield = class {
    constructor(name, options) {
        this.name = name;
        this.fields = [];

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

    getFields() {
        return this.fields;
    }

    getName() {
        return this.name;
    }

    clearValue() {
        for (const field of this.fields) {
            field.clearValue();
        }
    }

    refreshFields(container) {
        throw new Error("This method should be overwritten in the subclass.");
    }

    checkFields(errorIDs) {
        for (const field of this.fields) {
            let fieldID = parseInt(field.field.attr('data-field-id'));
            let subfieldID = parseInt(field.field.attr('data-subfield-id'));

            console.log("name: " + field.getName());
            console.log("fieldID: " + fieldID);
            console.log("subfieldID: " + subfieldID);

            if (fieldID > -1 && subfieldID > -1) {
                if (errorIDs.hasOwnProperty(fieldID) && errorIDs[fieldID].indexOf(subfieldID) > -1) {
                    field.markAsIncorrect();
                } else {
                    field.clear();
                }
            } else {
                if (errorIDs.indexOf(fieldID) > -1) {
                    field.markAsIncorrect();
                } else {
                    field.clear();
                }
            }
        }
    }

    clear() {
        for (const field of this.fields) {
            field.clear();
        }
    }

    disable() {
        for (const field of this.fields) {
            field.disable();
        }

        return this;
    }
}