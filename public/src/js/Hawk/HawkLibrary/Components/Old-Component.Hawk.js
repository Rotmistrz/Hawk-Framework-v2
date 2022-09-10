Hawk.Component = class {
    constructor(classname, values, options, id) {
        this.classname = classname;
        this.container;

        this.values = values;

        this.properties = options.properties || {};
        this.methods = options.methods || {};

        this.id = id || -1;

        this.onRefresh = options.onRefresh || function() {};
        this.onClick = options.onClick || function(component) {};
        this.onCreateFromDOM = options.onCreateFromDOM || function(container, values) {
            return values;
        };
    }

    getID() {
        return this.id;
    }

    getClassname() {
        return this.classname;
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

        this.onRefresh(key, value, this);

        return this;
    }

    getProperty(key) {
        var property = this.properties[key];

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

    run() {
        var allComponentBindings = {};

        this.container = this.getContainer();
    }
}