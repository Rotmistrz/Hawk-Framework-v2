Hawk.Component = class {
    constructor(id) {
        this.id = id || -1;

        this.values = {};
        this.properties = {};
        this.methods = {};
    }

    getClassID() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getClassname() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getID() {
        return this.id;
    }

    set(key, value) {
        this.values[key] = value;

        return this;
    }

    get(key) {
        return this.values[key];
    }

    update(key, value) {
        this.set(key, value);

        this.refreshView();

        return this;
    }

    getProperty(key) {
        const property = this.properties[key];

        return property(this);
    }

    getContainer() {
        if (this.getID() != -1) {
            return $('.' + this.getClassname() + '[' + Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE + '="' + this.getID() + '"]');
        } else {
            return $('.' + this.getClassname());
        }
    }

    getElement(name) {
        return this.getContainer().find('.' + this.getClassname() + '__' + name);
    }

    refreshView() {
        let element = this.getElement("id");

        element.html(this.getID());

        for (const i in this.values) {
            element = this.getElement(i);

            element.html(this.values[i]);
        }

        for (const i in this.properties) {
            element = this.getElement(i);

            element.html(this.getProperty(i));
        }

        // for (var i in this.subcomponents) {
        //
        //     for (let j in this.subcomponents[i]) {
        //         if (this.subcomponents[i][j].hasOwnProperty('refreshView')) {
        //             this.subcomponents[i][j].refreshView();
        //         }
        //
        //     }
        // }

        for (const i in this.methods) {
            this.methods[i](this);
        }
    }

    remove() {
        const container = this.getContainer();

        container.velocity("slideUp", {
            complete: function() {
                container.remove();
            }
        });
    }

    prepareFromDOM() {
        for (const i in this.values) {
            const element = this.getElement(i);

            if (element.is('input, textarea')) {
                this.values[i] = element.val();
            } else {
                this.values[i] = element.text().trim();
            }
        }
    }
}