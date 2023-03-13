Hawk.Component = class {
    constructor(id) {
        this.id = id || -1;

        this.instanceNew = false;

        this.values = {};
        this.properties = {};
        this.methods = {};
        this.subcomponentsFilters = {};

        this.subcomponents = {};
    }

    static getClassID() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    static getClassname() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    static getAppContext() {
        if (typeof AppContext != 'undefined') {
            return AppContext;
        } else {
            return {};
        }
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

    isDescendingOrder() {
        return false;
    }

    getID() {
        return this.id;
    }

    updateInstance(anotherInstance) {
        this.values = anotherInstance.values;
        this.subcomponents = anotherInstance.subcomponents;

        this.refreshView();
        // for (var i in this.values) {
        //     this.values[i] = anotherInstance.get(i);
        // }
        //
        // for (var s in this.subcomponents) {
        //     this.subcomponents[s] = anotherInstance.subcomp
        // }
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

        if (subcomponent.isDescendingOrder()) {
            this.subcomponents[subcomponent.constructor.getClassID()].unshift(subcomponent);
        } else {
            this.subcomponents[subcomponent.constructor.getClassID()].push(subcomponent);
        }
    }

    getSubcomponent(className, id) {
        if (typeof this.subcomponents[className] != 'undefined') {
            for (const subcomponent of this.subcomponents[className]) {
                if (subcomponent.getID() == id) {
                    return subcomponent;
                }
            }

            return null;
        } else {
            return null;
        }
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

        if (subcomponent.isDescendingOrder()) {
            subcomponentsContainer.prepend(subcomponentHTML);
        } else {
            subcomponentsContainer.append(subcomponentHTML);
        }

        subcomponent.refreshView();
        subcomponentHTML.velocity("slideDown");
    }

    getSubcomponents(classID) {
        if (typeof this.subcomponentsFilters[classID] == 'function' && typeof this.subcomponents[classID] != 'undefined') {
            return this.subcomponentsFilters[classID](this.subcomponents[classID]);
        } else {
            return this.subcomponents[classID];
        }
    }

    refreshSubcomponents(classID) {
        this.clearSubcomponentsContainer(classID);

        const theseSubcomponents = this.getSubcomponents(classID);

        for (const subcmpt of theseSubcomponents) {
            this.showSubcomponent(subcmpt);
        }
    }

    updateElementValue(element, value) {
        if (element.is('input')) {
            element.val(value);
        } else {
            element.html(value);
        }
    }

    refreshValues() {
        for (const i in this.values) {
            const element = this.getElement(i);

            this.updateElementValue(element, this.values[i]);
        }
    }

    refreshProperties() {
        for (const i in this.properties) {
            const element = this.getElement(i);

            this.updateElementValue(element, this.getProperty(i));
        }
    }

    refreshAllSubcomponents() {
        for (var i in this.subcomponents) {
            this.refreshSubcomponents(i);

            // this.clearSubcomponentsContainer(i);
            //
            // const theseSubcomponents = this.getSubcomponents(i);
            //
            // for (const j in theseSubcomponents) {
            //     const ThisSubcomponent = theseSubcomponents[j];
            //
            //     this.showSubcomponent(ThisSubcomponent);
            //     //container.append(Assignee.getAsHTML());
            //
            //     //Assignee.refreshView();
            // }
            // for (let j in this.subcomponents[i]) {
            //     console.log(this.subcomponents[i][j].getID());
            //
            //     //if (this.subcomponents[i][j].hasOwnProperty('refreshView')) {
            //         this.subcomponents[i][j].refreshView();
            //     //}
            //
            // }
        }
    }

    refreshMethods() {
        for (const i in this.methods) {
            this.methods[i](this);
        }
    }

    refreshView() {
        let element = this.getElement("id");

        element.html(this.getID());

        this.refreshValues();

        this.refreshProperties();

        this.refreshAllSubcomponents();

        this.refreshMethods();
    }

    remove() {
        const container = this.getContainer();

        container.velocity("slideUp", {
            complete: function() {
                container.remove();
            }
        });
    }

    setIsNew(instanceNew) {
        this.instanceNew = instanceNew;

        return this;
    }

    isInstanceNew() {
        return this.instanceNew;
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