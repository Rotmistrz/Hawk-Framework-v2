Hawk.ComponentClass = class {
    constructor(classname, values, options) {
        this.classname = classname;

        this.values = values;
        this.options = options;

        this.clearInstances();
    }
    

    // this.parseJSON = parseJSON || function(json) {
    //     return {
    //         id: -1,
    //         values: {},
    //         subcomponents: {}
    //     };
    // };

    
    getOptions() {
        return this.options;
    }

    getValues() {
        return this.values;
    }

    newInstance(id, values) {
        let certainValues = this.getValues();

        if (typeof values != 'undefined') {
            certainValues = this.parseValues(values);
        }
        
        const instance = new Hawk.Component(this.getClassname(), certainValues, this.getOptions(), id);
        instance.run();
        instance.refreshView();

        this.instances[instance.getID()] = instance;

        return instance;

    }

    instanceExists(index) {
        return typeof this.instances[index] != 'undefined';
    }

    parseValues(certainValues) {
        const resultValues = {};

        for (let i in this.values) {
            if (typeof certainValues[i] != 'undefined') {
                resultValues[i] = certainValues[i];
            }
        }

        return resultValues;
    }

    getInstance(index) {
        if (this.instanceExists(index)) {
            return this.instances[index];
        } else {
            return null;
        }
    }

    getValueFromDOM(container, name) {
        const element = container.find('.' + this.getClassname() + "__" + name);

        if (element.length > 0) {
            return element.html();
        } else {
            return null;
        }
    }

    createInstanceFromDOM(container, id) {
        let currentValues = {};

        for (let name in this.values) {
            currentValues[name] = this.getValueFromDOM(container, name);
        }

        currentValues = this.options.onCreateFromDOM(container, currentValues);

        this.newInstance(id, currentValues);
    }

    getAllInstances() {
        return this.instances;
    }

    updateAll(key, value) {
        for (var i in this.instances) {
            this.instances[i].update(key, value);
        }
    }

    removeInstance(index) {
        if (this.instanceExists(index)) {
            const current = this.instances[index];

            current.remove();

            delete this.instances[index];
        }
    }

    refreshView() {
        for (let i in this.instances) {
            this.instances[i].refreshView();
        }
    }

    clearInstances() {
        this.instances = {};
    }

    getClassname() {
        return this.classname;
    }

    initialize() {
        const components = $('.' + this.getClassname());

        let currentID = -1;

        const that = this;

        components.each(function() {
            currentID = $(this).attr(Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE);

            if (currentID > 0) {
                that.createInstanceFromDOM($(this), currentID);
            }
        });
    }
}