Hawk.ComponentController = class {
    constructor(options) {
        this.defaultOptions = {
            singleInstanceContainerClass: 'hawk-component-container', // is it necessary?

            onComponentsLoad: (controller, id) => {},
            onComponentsLoadingComplete: (controller, id) => {},

            ordering: 'ASC'
        };

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

        //console.log(this.constructor.getClassID() + " - ORDER: " + this.options.order);

        this.instances = {};
    }

    createFromJSON(json) {
        throw new Error("This method should be overwritten in the subclass.");
    }

    createFromDOM(id) {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getLoadingSingleComponentPath(id) {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getLoadingComponentsPath(id) {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getSingleInstanceContainerClass() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getInstancesContainerClass() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    static getClassID() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    putInstance(instance) {
        this.instances[instance.getID()] = instance;

        return this;
    }

    getInstance(id) {
        return this.instances[id] || null;
    }

    attachInstance(instance) {
        const instancesContainer = this.getInstancesContainer();

        console.log(this.options.ordering);

        if (this.options.ordering == 'DESC') {
            instancesContainer.prepend(instance.getAsHTML());
        } else {
            instancesContainer.append(instance.getAsHTML());
        }

        instance.refreshView();

        this.putInstance(instance);
    }

    getInstancesContainer() {
        return $('.' + this.getInstancesContainerClass() + '[' + Hawk.ComponentsConstants.COMPONENT_CLASS_ID_ATTRIBUTE + '="' + this.constructor.getClassID() + '"]');
    }

    getSingleInstanceContainer(id) {
        return $('.' + this.getSingleInstanceContainerClass() + '[' + Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE + '="' + id + '"]');
    }

    load(id) {
        console.log("PATH: " + this.getLoadingComponentsPath(id));

        $.ajax({
            url: this.getLoadingComponentsPath(id),
            type: 'GET',
            data: {},
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: (result) => {
                console.log(result);

                if (result.status == Hawk.RequestStatus.SUCCESS) {
                    const instancesContainer = this.getInstancesContainer();

                    if (typeof result.html != 'undefined') {
                        instancesContainer.html(result.html);

                        for (const instanceJSON of result.instances) {
                            const instance = this.createFromJSON(instanceJSON);

                            this.putInstance(instance);

                            instance.refreshView();

                            console.log(instance);
                        }
                    } else {
                        instancesContainer.html("");

                        for (const instanceJSON of result.instances) {
                            const instance = this.createFromJSON(instanceJSON);

                            this.attachInstance(instance);

                            instance.refreshView();

                            console.log(instance);
                        }
                    }

                    this.options.onComponentsLoad(this, id);
                } else if (result.status == Hawk.RequestStatus.ERROR) {

                } else {

                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseText);

                //console.log(errorThrown);
            },
            complete: (jqXHR) => {
                this.options.onComponentsLoadingComplete(this);
            }
        });
    }

    loadOne(id) {
        console.log("PATH: " + this.getLoadingSingleComponentPath(id));

        $.ajax({
            url: this.getLoadingSingleComponentPath(id),
            type: 'GET',
            data: {},
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: (result) => {
                if (result.status == Hawk.RequestStatus.SUCCESS) {
                    const instance = this.createFromJSON(result.instance);

                    this.putInstance(instance);

                    const instanceContainer = this.getSingleInstanceContainer(result.id);
                    instanceContainer.html(result.html);

                    instance.refreshView();

                    console.log(instance);

                    this.options.onComponentsLoad(this, id);

                } else if (result.status == Hawk.RequestStatus.ERROR) {

                } else {

                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseText);

                //console.log(errorThrown);
            },
            complete: (jqXHR) => {
                this.options.onComponentsLoadingComplete(this, id);
            }
        });
    }
}