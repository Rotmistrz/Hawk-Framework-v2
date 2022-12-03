Hawk.Component = class {
    constructor(id) {
        this.id = id || -1;

        this.values = {};
        this.properties = {};
        this.methods = {};

        this.subcomponents = {};
    }

    static getClassID() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    static getClassname() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getRepresentativeName() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getURL() {
        return Hawk.TextParser.preparePlainPath(this.getRepresentativeName());
    }

    getAsHTML() {
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
            return $('.' + this.constructor.getClassname() + '[' + Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE + '="' + this.getID() + '"]');
        } else {
            return $('.' + this.constructor.getClassname());
        }
    }

    getElement(name) {
        if (this.getID() != -1) {
            return this.getContainer().find('.' + this.constructor.getClassname() + '__' + name).filter((index, current) => {
                const parents = $(current).parents('.' + this.constructor.getClassname());

                return parents.eq(0).attr(Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE) == this.getID();
            });
        } else {
            return this.getContainer().find('.' + this.constructor.getClassname() + '__' + name);
        }
    }

    addSubcomponent(subcomponent) {
        if (typeof this.subcomponents[subcomponent.constructor.getClassID()] == 'undefined') {
            this.subcomponents[subcomponent.constructor.getClassID()] = [];
        }

        this.subcomponents[subcomponent.constructor.getClassID()].push(subcomponent);
    }

    getSubcomponentsContainer(className) {
        return this.getElement('subcomponents').filter('[' + Hawk.ComponentsConstants.COMPONENT_CLASS_ID_ATTRIBUTE + '="' + className + '"]');
    }

    clearSubcomponentsContainer(className) {
        const subcomponentsContainer = this.getSubcomponentsContainer(className);

        subcomponentsContainer.html('');

        return this;
    }

    clearSubcomponents(className) {
        if (typeof this.subcomponents[className] != 'undefined') {
            this.subcomponents[className] = [];
        }
    }

    placeSubcomponent(subcomponent, html) {
        this.addSubcomponent(subcomponent);

        this.showSubcomponent(subcomponent, html);
    }

    showSubcomponent(subcomponent, html) {
        if (typeof html == 'undefined') {
            html = subcomponent.getAsHTML();
        }

        const subcomponentsContainer = this.getSubcomponentsContainer(subcomponent.constructor.getClassID());

        const subcomponentHTML = $(html);
        subcomponentHTML.css({ display: 'none' });

        subcomponentsContainer.append(subcomponentHTML);

        subcomponent.refreshView();
        subcomponentHTML.velocity("slideDown");
    }

    getSubcomponents(className) {
        return this.subcomponents[className];
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

            this.clearSubcomponentsContainer(i);

            const theseSubcomponents = this.getSubcomponents(i);

            for (const j in theseSubcomponents) {
                const ThisSubcomponent = theseSubcomponents[j];

                this.showSubcomponent(ThisSubcomponent);
                //container.append(Assignee.getAsHTML());

                //Assignee.refreshView();
            }
            // for (let j in this.subcomponents[i]) {
            //     console.log(this.subcomponents[i][j].getID());
            //
            //     //if (this.subcomponents[i][j].hasOwnProperty('refreshView')) {
            //         this.subcomponents[i][j].refreshView();
            //     //}
            //
            // }
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