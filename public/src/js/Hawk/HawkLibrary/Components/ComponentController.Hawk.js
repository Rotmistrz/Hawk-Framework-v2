Hawk.ComponentController = class {
    constructor(options) {
        this.defaultOptions = {
            singleInstanceContainerClass: 'hawk-component-container', // is it necessary?

            onComponentsLoad: (controller) => {}
        };

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

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

    getLoadingComponentsPath() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getSingleInstanceContainerClass() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    getInstancesContainerClass() {
        throw new Error("This method should be overwritten in the subclass.");
    }

    putInstance(id, instance) {
        this.instances[id] = instance;

        return this;
    }

    getInstance(id) {
        return this.instances[id] || null;
    }

    loadOne(id) {
        $.ajax({
            url: this.getLoadingSingleComponentPath(id),
            type: 'GET',
            data: {},
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: (result) => {
                console.log(result);

                if (result.status == Hawk.RequestStatus.SUCCESS) {
                    const instance = this.createFromJSON(result.instance);

                    this.putInstance(id, instance);

                    $('.' + this.getSingleInstanceContainerClass() + '[' + Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE + '="' + result.id + '"]').html(result.html);

                    instance.refreshView();

                    this.options.onComponentsLoad(this);

                } else if (result.status == Hawk.RequestStatus.ERROR) {

                } else {

                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseText);

                //console.log(errorThrown);
            },
            complete: (jqXHR) => {

            }
        });
    }
}