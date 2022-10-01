Hawk.Component = class {
    constructor(id) {
        this.id = id || -1;

        this.values = {};
        this.properties = {};
        this.methods = {};

        this.subcomponents = {};
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
        if (this.getID() != -1) {
            return this.getContainer().find('.' + this.getClassname() + '__' + name).filter((index, current) => {
                const parents = $(current).parents('.' + this.getClassname());

                return parents.eq(0).attr(Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE) == this.getID();
            });
        } else {
            return this.getContainer().find('.' + this.getClassname() + '__' + name);
        }
    }

    addSubcomponent(subcomponent) {
        if (typeof this.subcomponents[subcomponent.getClassID()] == 'undefined') {
            this.subcomponents[subcomponent.getClassID()] = [];
        }

        this.subcomponents[subcomponent.getClassID()].push(subcomponent);
    }

    placeSubcomponent(subcomponent, html) {
        const subcomponentsContainer = this.getElement('subcomponents').filter('[' + Hawk.ComponentsConstants.COMPONENT_CLASS_ID_ATTRIBUTE + '="' + subcomponent.getClassID() + '"]');

        this.addSubcomponent(subcomponent);

        const subcomponentHTML = $(html);
        subcomponentHTML.css({ display: 'none' });

        subcomponentsContainer.append(subcomponentHTML);

        subcomponent.refreshView();
        subcomponentHTML.velocity("slideDown");
    }

    updateElementValue(element, value) {
        if (element.is('input')) {
            element.val(value);
        } else {
            element.html(value);
        }
    }

    refreshView() {
        let element = this.getElement("id");

        element.html(this.getID());

        for (const i in this.values) {
            element = this.getElement(i);

            this.updateElementValue(element, this.values[i]);
        }

        for (const i in this.properties) {
            element = this.getElement(i);

            this.updateElementValue(element, this.getProperty(i));
        }

        for (var i in this.subcomponents) {
            console.log("refreshing subcomponents: " + i);

            for (let j in this.subcomponents[i]) {
                console.log(this.subcomponents[i][j].getID());

                //if (this.subcomponents[i][j].hasOwnProperty('refreshView')) {
                    this.subcomponents[i][j].refreshView();
                //}

            }
        }

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