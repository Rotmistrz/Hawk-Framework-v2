import Hawk from '../../Bundle.Hawk';

export default class ComponentController {
    constructor(options) {
        this.defaultOptions = {
            singleInstanceContainerClass: 'hawk-component-container', // is it necessary?

            onComponentsLoad: (controller, id) => {},
            onComponentsLoadingComplete: (controller, id) => {},

            appendComponents: (controller, result) => {
                const instancesContainerContent = controller.getInstancesContainerContent();

                if (typeof result.html != 'undefined') {
                    instancesContainerContent.html(result.html);

                    controller.parseInstances(result.instances);
                } else {
                    instancesContainerContent.html("");

                    controller.attachInstances(result.instances);
                }
            },
            getInstanceAsHTML: (instance) => {
                return instance.getAsHTML();
            },

            ordering: 'ASC',
            requestType: 'GET'
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

    getInstancesContainerContentClass() {
        return "hawk-instances-container__content";
    }

    getLoadingLayerClass() {
        return "hawk-instances-container__loading-layer";
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

    attachInstance(instance, ordering) {
        if (typeof ordering == 'undefined') {
            ordering = this.options.ordering;
        }

        const instancesContainerContent = this.getInstancesContainerContent();

        if (ordering == 'DESC') {
            instancesContainerContent.prepend(this.options.getInstanceAsHTML(instance));
        } else {
            instancesContainerContent.append(this.options.getInstanceAsHTML(instance));
        }

        instance.refreshView();

        this.putInstance(instance);
    }

    getInstancesContainer() {
        return $('.' + this.getInstancesContainerClass() + '[' + Hawk.ComponentsConstants.COMPONENT_CLASS_ID_ATTRIBUTE + '="' + this.constructor.getClassID() + '"]');
    }

    getInstancesContainerContent() {
        const container = this.getInstancesContainer();

        return container.find('.' + this.getInstancesContainerContentClass());
    }

    getLoadingLayer() {
        const container = this.getInstancesContainer();

        return container.find('.' + this.getLoadingLayerClass());
    }

    getSingleInstanceContainer(id) {
        return $('.' + this.getSingleInstanceContainerClass() + '[' + Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE + '="' + id + '"]');
    }

    parseInstances(instances) {
        for (const instanceJSON of instances) {
            const instance = this.createFromJSON(instanceJSON);

            this.putInstance(instance);

            instance.refreshView();
        }
    }

    attachInstances(instances) {
        for (const instanceJSON of instances) {
            const instance = this.createFromJSON(instanceJSON);

            this.attachInstance(instance);

            instance.refreshView();
        }
    }

    load(id, extraData, url) {
        if (typeof extraData == 'undefined') {
            extraData = {};
        }

        const loadingLayer = this.getLoadingLayer();

        loadingLayer.css({ display: 'block' });

        // console.log("PATH: " + this.getLoadingComponentsPath(id));
        //

        Hawk.writeDebugInfo(extraData);

        if (typeof url == 'undefined') {
            url = this.getLoadingComponentsPath(id);
        }

        Hawk.writeDebugInfo(url);

        $.ajax({
            url: url,
            type: this.options.requestType,
            data: extraData,
            // cache: false,
            // processData: false, // Don't process the files
            // contentType: false,
            dataType: "json",
            success: (result) => {
                Hawk.writeDebugInfo(result);

                if (result.status == Hawk.RequestStatus.SUCCESS) {
                    this.options.appendComponents(this, result);

                    this.options.onComponentsLoad(this, id);

                } else if (result.status == Hawk.RequestStatus.ERROR) {

                } else {

                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                Hawk.writeDebugError(jqXHR.responseText);

                //console.log(errorThrown);
            },
            complete: (jqXHR) => {
                loadingLayer.css({ display: 'none' });

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
