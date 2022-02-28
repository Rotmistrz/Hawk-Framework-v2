var Hawk = {};
Hawk = {
    w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    hash: window.location.hash,
    anchorSuffix: '-anchor',
}
Hawk.RequestStatus = {
    SUCCESS: 0,
    ERROR: 1,
    EXCEPTION: 2
};
Hawk.anchorRegex = new RegExp("^[^\/]+$");
Hawk.getPreparedHash = function(withoutLeadingHashSign) {
    if (typeof withoutLeadingHashSign == 'undefined' || !withoutLeadingHashSign) {
        return this.hash.replaceAll('/', '');
    } else {
        return this.hash.substring(1).replaceAll('/', '');
    }
}
Hawk.isInObject = function(value, obj) {
    for (var k in obj) {
        if (!obj.hasOwnProperty(k)) {
            continue;
        }
        if (obj[k] === value) {
            return true;
        }
    }
    return false;
}
Hawk.createBundleFromString = function(str) {
    var parts = str.split('&');
    var result = {};
    var current;
    var data;
    var key;
    var value;
    for (var i in parts) {
        current = parts[i];
        data = current.split('=');
        key = data[0];
        value = data[1];
        result[key] = value;
    }
    return result;
}
Hawk.mergeObjects = function(mainObject, object) {
    var result = {};
    if (object === undefined) {
        return mainObject;
    }
    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = (object.hasOwnProperty(property)) ? object[property] : mainObject[property];
        }
        //console.log("object." + property + ": " + result[property]);
    }
    return result;
}
Hawk.mergeWholeObjects = function(mainObject, object) {
    var result = {};
    if (object === undefined) {
        return mainObject;
    }
    for (var property in mainObject) {
        if (mainObject.hasOwnProperty(property)) {
            result[property] = mainObject[property];
        }
        //console.log("object." + property + ": " + result[property]);
    }
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            result[property] = object[property];
        }
        //console.log("object." + property + ": " + result[property]);
    }
    return result;
}
Hawk.addZeros = function(number, digits) {
    number = number + "";
    for (var i = 1; i <= digits; i++) {
        if (number.length < digits) {
            number = "0" + number;
        }
    }
    return number;
}
Hawk.jQueryFromString = function(html) {
    return $(html).filter(function() {
        return this.nodeType != 3; // Node.TEXT_NODE
    });
}
Hawk.Validator = {};
Hawk.Validator.isEmail = function(email) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email)) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.isPhoneNumber = function(number) {
    if (/^\+?[0-9]+[0-9\s]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.isNumber = function(number) {
    if (/^[0-9]+$/.test(number)) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.isShortPhoneNumber = function(number) {
    if (/^[0-9\s]+$/.test(number)) {
        number = number.replace("\s", "");
        return number.length == 9;
    } else {
        return false;
    }
}
Hawk.Validator.isNotEmpty = function(value) {
    if (value.trim().length > 0) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.longerThan = function(str, length) {
    if (str.trim().length > length) {
        return true;
    } else {
        return false;
    }
}
Hawk.Validator.isSomethingChecked = function(field) {
    if (field.is(':checked')) {
        return true;
    } else {
        return false;
    }
}
Hawk.RequestStatus = {
    SUCCESS: 0,
    ERROR: 1,
    EXCEPTION: 2
};
Hawk.RequestType = {
    GET: 'GET',
    POST: 'POST',
};
Hawk.AjaxRequestManager = function(options) {
    const that = this;
    this.ajaxRequest;
    this.ajaxRequestWorking = false;
    this.defaultOptions = {
        onSuccess: function() {},
        onError: function() {},
        onException: function() {},
        onComplete: function() {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.post = function(path, bundle, callbacks) {
        this.sendRequest(path, Hawk.RequestType.POST, bundle, callbacks);
    }
    this.get = function(path, callbacks) {
        this.sendRequest(path, Hawk.RequestType.GET, {}, callbacks);
    }
    this.sendRequest = function(path, type, bundle, callbacks) {
        if (this.ajaxRequestWorking) {
            return false;
        }
        this.ajaxRequestWorking = true;
        const onSuccess = callbacks.onSuccess || this.options.onSuccess;
        const onFailure = callbacks.onFailure || this.options.onFailure;
        const onError = callbacks.onError || this.options.onError;
        const onComplete = callbacks.onComplete || this.options.onComplete;
        this.ajaxRequest = $.ajax({
            type: type,
            url: path,
            dataType: "json",
            data: bundle,
            success: function(result) {
                console.log(result);
                if (typeof result.status != 'undefined' && result.status == Hawk.RequestStatus.SUCCESS) {
                    console.log("SUCCESS");
                    onSuccess(result);
                } else if (typeof result.status != 'undefined' && result.status == Hawk.RequestStatus.ERROR) {
                    console.log("ERROR");
                    onError(result);
                } else {
                    console.log("EXCEPTION");
                    onException(result);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);
                onException(jqXHR.responseText);
            },
            complete: function() {
                that.ajaxRequestWorking = false;
                onComplete();
            }
        });
        return this;
    }
}
Hawk.DropdownConstants = {
    Modes: {
        PLAIN: 0,
        CHOOSABLE: 1
    },
    Types: {
        OVERLAYER: 0,
        EXPANDING: 1
    },
    Directions: {
        DOWNWARDS: 0,
        UPWARDS: 1
    }
}
Hawk.Dropdown = function(container, options) {
    var that = this;
    this.container = $(container).first();
    this.header;
    this.title;
    this.list;
    this.listContainer;
    this.startEscapeSensor;
    this.sensor;
    this.endSensor;
    this.escapeSensor;
    this.fields;
    this.states = {
        CLOSED: 0,
        OPEN: 1
    }
    this.defaultOptions = {
        slideSpeed: 200,
        type: Hawk.DropdownConstants.Types.OVERLAYER,
        direction: Hawk.DropdownConstants.Directions.DOWNWARDS,
        containerClass: 'hawk-dropdown',
        expandingTypeClass: 'hawk-dropdown--expanding',
        upwardsDirectionClass: 'hawk-dropdown--upwards',
        openClass: 'hawk-dropdown--open',
        headerClass: 'hawk-dropdown__header',
        titleClass: 'hawk-dropdown__title',
        listClass: 'hawk-dropdown__list',
        listContainerClass: 'hawk-dropdown__list-container',
        startEscapeSensorClass: 'hawk-dropdown__start-escape-sensor',
        sensorClass: 'hawk-dropdown__sensor',
        endSensorClass: 'hawk-dropdown__end-sensor',
        escapeSensorClass: 'hawk-dropdown__escape-sensor',
        onShow: function(dropdown) {},
        onHide: function(dropdown) {},
        onRadioSelected: function(dropdown, field) {
            var description = field.parent().find('.dropdown-item__description').html();
            dropdown.title.html(description);
            dropdown.hide();
            return true;
        }
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.state = this.states.CLOSED;
    this.mode = this.options.mode;
    this.type = this.options.type;
    this.setOpen = function() {
        this.state = this.states.OPEN;
        return this;
    }
    this.setClosed = function() {
        this.state = this.states.CLOSED;
        return this;
    }
    this.isOpen = function() {
        return this.state == this.states.OPEN;
    }
    this.show = function() {
        this.container.addClass(that.options.openClass);
        this.listContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof that.options.onShow === 'function') {
                    that.options.onShow(that);
                }
            }
        });
        this.setOpen();
        return this;
    }
    this.hide = function() {
        this.container.removeClass(that.options.openClass);
        this.listContainer.velocity("slideUp", {
            duration: that.options.slideSpeed,
            complete: function() {
                if (typeof that.options.onHide === 'function') {
                    that.options.onHide(that);
                }
            }
        });
        this.setClosed();
        return this;
    }
    this.select = function(field) {
        if (field.length > 0) {
            return this.options.onRadioSelected(this, field);
        } else {
            return false;
        }
    }
    this.selectByIndex = function(index) {
        const field = this.fields.eq(index);
        return this.select(field);
    }
    this.selectByValue = function(value) {
        const field = this.fields.filter(function() {
            return $(this).val() == value;
        });
        return this.select(field);
    }
    this.createSensor = function(className) {
        var sensor = $('<input type="checkbox" />');
        sensor.addClass(className);
        return sensor;
    }
    this.run = function() {
        this.header = this.container.find('.' + this.options.headerClass);
        this.title = this.container.find('.' + this.options.titleClass);
        this.list = this.container.find('.' + this.options.listClass);
        this.listContainer = this.container.find('.' + this.options.listContainerClass);
        this.sensor = this.createSensor(this.options.sensorClass);
        this.container.prepend(this.sensor);
        this.startEscapeSensor = this.createSensor(this.options.startEscapeSensorClass);
        this.container.prepend(this.startEscapeSensor); //.find('.' + this.options.startEscapeSensorClass);
        ///.find('.' + this.options.sensorClass);
        this.endSensor = this.createSensor(this.options.endSensorClass);
        this.container.append(this.endSensor); //.find('.' + this.options.endSensorClass);
        this.escapeSensor = this.createSensor(this.options.escapeSensorClass);
        this.container.append(this.escapeSensor); //.find('.' + this.options.escapeSensorClass);
        this.fields = this.list.find('input[type="radio"]');
        if (this.options.type === Hawk.DropdownConstants.Types.EXPANDING) {
            this.container.addClass(this.options.expandingTypeClass);
        }
        if (this.options.direction === Hawk.DropdownConstants.Directions.UPWARDS) {
            this.container.addClass(this.options.upwardsDirectionClass);
        }
        this.hide();
        this.container.click(function(e) {
            e.stopPropagation();
        });
        this.header.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (that.isOpen()) {
                that.hide();
            } else {
                that.show();
            }
        });
        this.startEscapeSensor.focus(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });
        this.sensor.focus(function() {
            if (!that.isOpen()) {
                that.show();
            }
        });
        this.endSensor.focus(function() {
            if (!that.isOpen()) {
                that.show();
            }
        });
        this.escapeSensor.focus(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });
        // this.sensor.blur(function() {
        //     setTimeout(function() {
        //         if (that.fields.filter(':focus').length === 0 && that.isOpen()) {
        //             that.hide();
        //         }
        //     }, 100);
        // });
        //
        // this.fields.blur(function() {
        //     setTimeout(function() {
        //         if (that.fields.add(that.sensor).filter(':focus').length === 0 && that.isOpen()) {
        //             that.hide();
        //         }
        //     }, 100);
        // });
        $('body').click(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });
        if (this.fields.length > 0) {
            this.fields.change(function() {
                if (typeof that.options.onRadioSelected == 'function') {
                    that.options.onRadioSelected(that, $(this));
                }
            });
        }
        return true;
    }
}
Hawk.LayeredSection = function(container, options) {
    var that = this;
    this.container = $(container).first();
    this.buttons;
    this.aboveLayers;
    this.baseLayer;
    this.baseLayerInner;
    this.defaultOptions = {
        containerClass: 'hawk-layered-section',
        baseLayerClass: 'hawk-layered-section__base-layer',
        baseLayerInnerClass: 'hawk-layered-section__base-layer-inner',
        aboveLayerClass: 'hawk-layered-section__above-layer',
        aboveLayerInnerClass: 'hawk-layered-section__above-layer-inner',
        buttonClass: 'hawk-layered-section__button',
        nameAttribute: 'data-name',
        baseLayerName: 'base',
        onAboveLayerShow: function(layeredSection, aboveLayer) {}
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.hideBaseLayer = function() {
        this.baseLayerInner.velocity({
            opacity: 0
        }, {
            complete: function() {
                that.baseLayer.css({
                    visibility: 'hidden'
                });
            }
        });
        return this;
    }
    this.showBaseLayer = function() {
        this.hideLayers();
        this.baseLayer.css({
            visibility: 'visible'
        });
        this.baseLayerInner.velocity({
            opacity: 1
        }, {});
        return this;
    }
    this.hideLayers = function(except) {
        this.aboveLayers.not('[' + that.options.nameAttribute + '="' + except + '"]').velocity("fadeOut");
        return this;
    }
    this.showLayer = function(name) {
        this.hideBaseLayer();
        this.hideLayers(name);
        var currentLayer = that.aboveLayers.filter('[' + that.options.nameAttribute + '="' + name + '"]');
        if (currentLayer.length > 0) {
            currentLayer.velocity("fadeIn", {
                complete: function() {
                    // currentLayer.find('.' + that.options.aboveLayerInnerClass).css({
                    //     opacity: 1
                    // });
                    that.options.onAboveLayerShow(that, currentLayer);
                }
            });
            return true;
        } else {
            return false;
        }
    }
    this.run = function() {
        this.buttons = this.container.find('.' + this.options.buttonClass);
        this.baseLayer = this.container.find('.' + this.options.baseLayerClass);
        this.baseLayerInner = this.container.find('.' + this.options.baseLayerInnerClass);
        this.aboveLayers = this.container.find('.' + this.options.aboveLayerClass);
        this.buttons.click(function() {
            var name = $(this).attr(that.options.nameAttribute);
            if (name !== that.options.baseLayerName) {
                that.showLayer(name);
            } else {
                that.showBaseLayer();
            }
        });
        return this;
    }
}
Hawk.FieldController = class {
    constructor(field, options) {
        this.defaultOptions = {
            onChange: function(field, value) {},
            onKeyDown: function(field, value) {}
        }
        this.field = $(field);
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    run() {
        var that = this;
        if (this.options.onChange !== this.defaultOptions.onChange) {
            this.field.change(function(e) {
                that.options.onChange($(this), $(this).val());
            });
        }
        if (this.options.onKeyDown !== this.defaultOptions.onKeyDown) {
            this.field.keydown(function(e) {
                setTimeout(function() {
                    that.options.onChange($(this), $(this).val());
                }, 32);
            });
        }
    }
}
Hawk.MoreContentManager = class {
    constructor(id, options) {
        this.defaultOptions = {
            buttonClass: "hawk-more-content-button",
            buttonContentClass: "hawk-more-content-button__content",
            contentClass: "hawk-more-content",
            IDAttrName: "data-id",
            managerIDAttrName: "data-more-content-manager",
            buttonOppositeTextAttr: "data-opposite-text",
            eventName: "click.moreContent",
            actionShow: function(content) {
                if (!content.is(":visible")) {
                    content.velocity("slideDown");
                }
            },
            actionHide: function(content) {
                if (content.is(":visible")) {
                    content.velocity("slideUp");
                }
            },
            onShow: function(mcm, button, content) {
                mcm.toggleButtonText(button);
            },
            onHide: function(mcm, button, content) {
                mcm.toggleButtonText(button);
            }
        }
        this.id = id;
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
        this.buttons = null;
        this.content = null;
    }
    getID() {
        return this.id;
    }
    getButtons() {
        return $('.' + this.options.buttonClass + '[' + this.options.managerIDAttrName + '="' + this.getID() + '"]');
    }
    getButton(id) {
        return $('.' + this.options.buttonClass + '[' + this.options.managerIDAttrName + '="' + this.getID() + '"]').filter('[' + this.options.IDAttrName + '="' + id + '"]');
    }
    getContent(id) {
        return $('.' + this.options.contentClass + '[' + this.options.managerIDAttrName + '="' + this.getID() + '"]').filter('[' + this.options.IDAttrName + '="' + id + '"]');
    }
    isContentVisible(id) {
        const content = this.getContent(id);
        return content.is(':visible');
    }
    toggleButtonText(button) {
        const oppositeText = button.attr(this.options.buttonOppositeTextAttr);
        const buttonContent = button.find('.' + this.options.buttonContentClass);
        button.attr(this.options.buttonOppositeTextAttr, buttonContent.text());
        buttonContent.text(oppositeText);
    }
    show(id) {
        this.button = this.getButton(id);
        this.content = this.getContent(id);
        this.options.actionShow(this.content);
        this.options.onShow(this, this.button, this.content);
    }
    hide(id) {
        this.button = this.getButton(id);
        this.content = this.getContent(id);
        this.options.actionHide(this.content);
        this.options.onHide(this, this.button, this.content);
    }
    refreshDependencies() {
        if (this.buttons !== null) {
            this.buttons.unbind(this.options.eventName);
        }
        const that = this;
        this.buttons = this.getButtons();
        this.buttons.bind(this.options.eventName, function() {
            let id = $(this).attr(that.options.IDAttrName);
            if (!that.isContentVisible(id)) {
                that.show(id);
            } else {
                that.hide(id);
            }
        });
    }
    run() {
        this.refreshDependencies();
    }
}
Hawk.SlidingLayerManager = class {
    constructor(id, options) {
        this.defaultOptions = {
            sectionClass: "hawk-sliding-layer-section",
            layerClass: "hawk-sliding-layer-section__layer",
            buttonClass: "hawk-sliding-layer-section__button",
            activeClass: "hawk-sliding-layer-section--active",
            managerIDAttrName: "data-sliding-layer-manager",
            IDAttrName: "data-id",
            eventName: "click.slidingLayer",
            actionShow: function(slm, section, layer) {
                section.addClass(slm.options.activeClass);
            },
            actionHide: function(slm, section, layer) {
                section.removeClass(slm.options.activeClass);
            },
            onShow: function(slm, button, layer) {},
            onHide: function(slm, button, layer) {}
        };
        this.id = id;
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
        this.buttons = null;
        this.button = null;
        this.section = null;
        this.layer = null;
    }
    getID() {
        return this.id;
    }
    getButtons() {
        return $('.' + this.options.buttonClass + '[' + this.options.managerIDAttrName + '="' + this.getID() + '"]');
    }
    getButton(id) {
        return $('.' + this.options.buttonClass + '[' + this.options.managerIDAttrName + '="' + this.getID() + '"]').filter('[' + this.options.IDAttrName + '="' + id + '"]');
    }
    getSection(id) {
        return $('.' + this.options.sectionClass + '[' + this.options.managerIDAttrName + '="' + this.getID() + '"]').filter('[' + this.options.IDAttrName + '="' + id + '"]');
    }
    isLayerVisible(id) {
        const section = this.getSection(id);
        return section.hasClass(this.options.activeClass);
    }
    show(id) {
        this.button = this.getButton(id);
        this.section = this.getSection(id);
        this.layer = this.section.find('.' + this.options.layerClass);
        this.options.actionShow(this, this.section, this.layer);
        const that = this;
        setTimeout(function() {
            that.options.onShow(that, that.button, that.layer);
        }, 400);
    }
    hide(id) {
        this.button = this.getButton(id);
        this.section = this.getSection(id);
        this.layer = this.section.find('.' + this.options.layerClass);
        this.options.actionHide(this, this.section, this.layer);
        this.options.onHide(this, this.button, this.layer);
    }
    refreshDependencies() {
        const that = this;
        if (this.buttons !== null) {
            this.buttons.unbind(this.options.eventName);
        }
        this.buttons = this.getButtons();
        this.buttons.bind(this.options.eventName, function() {
            let id = $(this).attr(that.options.IDAttrName);
            if (!that.isLayerVisible(id)) {
                that.show(id);
            } else {
                that.hide(id);
            }
        });
    }
    run() {
        this.refreshDependencies();
    }
}
Hawk.SingleThreadClass = class {
    constructor() {
        this.request = null;
        this.requestWorking = false;
    }
    setRequest(request) {
        this.request = request;
        return this;
    }
    getRequest() {
        return this.request;
    }
    abortRequest() {
        if (typeof this.request != 'undefined') {
            this.request.abort();
        }
        return this;
    }
    clearRequest() {
        this.request = null;
        return this;
    }
    isWorking() {
        return this.requestWorking;
    }
    startWorking() {
        this.requestWorking = true;
    }
    finishWorking() {
        this.requestWorking = false;
    }
}
Hawk.AjaxLoadingItemsManager = class extends Hawk.SingleThreadClass {
    constructor(container, options) {
        super();
        this.container = $(container);
        this.offset = 0;
        this.done = false;
        this.filters = {};
        this.buttons;
        this.contentContainer;
        this.loadingLayer;
        this.defaultOptions = {
            itemsPerLoading: 6,
            path: "ajax/load-items",
            itemClass: "ajax-loading-items-manager__item",
            buttonClass: "ajax-loading-items-manager__button",
            contentContainerClass: "ajax-loading-items-manager__content-container",
            slideSpeed: 400,
            fadeSpeed: 400,
            appendItems: function(contentContainer, items) {
                contentContainer.append(items);
            },
            onLoad: function(buttons, contentContainer) {},
            onDone: function(buttons, contentContainer) {
                buttons.velocity({
                    opacity: 0
                }, {
                    complete: function() {
                        buttons.css({
                            visibility: "hidden"
                        });
                    }
                });
            },
            onError: function(buttons, contentContainer) {}
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    isDone() {
        return this.done;
    }
    setFilter(name, value) {
        this.filters[name] = value;
        return this;
    }
    load(offset) {
        if (!this.isWorking()) {
            this.startWorking();
            this.setRequest($.ajax({
                type: "POST",
                url: this.options.path,
                dataType: "json",
                data: {
                    offset: offset,
                    itemsPerLoading: this.options.itemsPerLoading
                },
                success: (result) => {
                    console.log(result);
                    this.appendContent(result.items);
                    this.offset = result.offset;
                    this.done = result.isDone;
                    if (this.isDone()) {
                        this.options.onDone(this.buttons, this.contentContainer);
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // here should appear error layer
                    //alert(errorThrown);
                    console.log(jqXHR.responseText);
                },
                complete: () => {
                    this.finishWorking();
                }
            }));
        }
    }
    appendContent(rawItems) {
        const items = Hawk.jQueryFromString(rawItems);
        items.css({
            opacity: 0
        });
        this.options.appendItems(this.contentContainer, items);
        items.velocity("slideDown", {
            duration: this.options.slideSpeed,
            complete: () => {
                items.velocity({
                    opacity: 1
                }, {
                    duration: this.options.fadeSpeed
                });
            }
        });
    }
    clear() {
        this.contentContainer.children().velocity("slideUp", {
            complete: function(elements) {
                $(elements).remove();
            }
        });
        this.buttons.css({
            visibility: 'visible'
        }).velocity({
            opacity: 1
        });
        this.offset = 0;
        this.done = false;
    }
    run() {
        this.buttons = this.container.find('.' + this.options.buttonClass);
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.buttons.click(() => {
            if (!this.isDone()) {
                this.load(this.offset);
            }
        });
    }
}
Hawk.FormField = class {
    constructor(name, options) {
        this.name = name;
        this.field = null;
        this.wrapper = null;
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
    getName() {
        return this.name;
    }
    getValue() {
        throw new Error("This method should be overwritten in the subclass.");
    }
    validate() {
        throw new Error("This method should be overwritten in the subclass.");
    }
    bind(form) {
        this.field = $(form).find('input[name="' + this.getName() + '"]');
        this.wrapper = this.options.obtainWrapper(this.field);
        return this.isBinded();
    }
    initializeObserving() {
        throw new Error("This method should be overwritten in the subclass.");
    }
    checkField() {
        if (this.validate()) {
            this.clear();
        } else {
            this.markAsIncorrect();
        }
    }
    isBinded() {
        return this.wrapper !== null && this.field !== null;
    }
    disable() {
        if (this.isBinded()) {
            this.field.attr('disabled', 'disabled');
        }
        return this;
    }
    markAsIncorrect() {
        this.wrapper.addClass(this.options.errorClass);
        return this;
    }
    clear() {
        this.wrapper.removeClass(this.options.errorClass);
        return this;
    }
    run(form) {
        this.bind(form);
        this.initializeObserving();
    }
}
Hawk.TextFormField = class extends Hawk.FormField {
    constructor(name, options) {
        super(name, options);
    }
    getValue() {
        return this.field.val();
    }
    validate() {
        return this.options.validate(this.getValue());
    }
    initializeObserving() {
        this.field.keydown(() => {
            setTimeout(() => {
                this.checkField();
            }, 10);
        });
    }
}
Hawk.FormSender = class extends Hawk.SingleThreadClass {
    constructor(form, fields, options) {
        super();
        this.form = $(form);
        this.fields = {};
        for (let i in fields) {
            const field = fields[i];
            this.fields[field.getName()] = field;
        }
        this.defaultOptions = {
            autoDisable: true,
            fadeSpeed: 200,
            slideSpeed: 200,
            infoContainerClass: "form__info-container",
            infoWrapperClass: "form__info-wrapper",
            infoClass: "form__info",
            spinnerClass: "form__spinner",
            obtainButton: (form) => {
                return form.find('button[type="submit"]');
            },
            obtainCancelButton: (form) => {
                return form.find('.form__cancel-button');
            },
            onCorrect: (result) => {
                this.defaultResultCallback(result);
            },
            onError: (result) => {
                this.defaultResultCallback(result);
            },
            onException: (result) => {
                this.defaultResultCallback(result);
            },
            onComplete: (result) => {}
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
        this.infoContainer = this.form.find('.' + this.options.infoContainerClass);
        this.infoWrapper = this.form.find('.' + this.options.infoWrapperClass);
        this.info = this.form.find('.' + this.options.infoClass);
        this.spinner = this.form.find('.' + this.options.spinnerClass);
        this.button = this.options.obtainButton(this.form);
        this.cancelButton = this.options.obtainCancelButton(this.form);
    }
    defaultResultCallback(result) {
        this.changeMessage(result.message);
    }
    getField(name) {
        return this.fields[name];
    }
    checkFields(incorrectFields) {
        for (let i in this.fields) {
            const current = this.fields[i];
            if (Hawk.isInObject(current.name, incorrectFields)) {
                current.markAsIncorrect();
            } else {
                current.clear();
            }
        }
        return this;
    }
    validate() {
        let result = [];
        for (let i in this.fields) {
            const current = this.fields[i];
            if (current.validate()) {
                current.clear();
            } else {
                current.markAsIncorrect();
                result.push(current.getName());
            }
        }
        return result;
    }
    bindFields() {
        for (let i in this.fields) {
            const current = this.fields[i];
            current.run(this.form);
        }
        return this;
    }
    hasMessageBeenShown() {
        return this.infoWrapper.is(':visible');
    }
    changeMessage(message) {
        if (this.hasMessageBeenShown()) {
            this.slideMessage(message);
        } else {
            this.hideMessage(() => {
                this.slideMessage(message);
            });
        }
    }
    slideMessage(message) {
        this.info.html(message);
        this.infoWrapper.velocity("slideDown", {
            duration: this.options.slideSpeed,
            complete: () => {
                this.showMessage();
            }
        });
    }
    showMessage() {
        this.info.velocity({
            opacity: 1
        }, {
            duration: 200
        });
    }
    hideMessage(callback) {
        this.info.velocity({
            opacity: 0
        }, {
            duration: this.options.fadeSpeed,
            complete: () => {
                if (typeof callback != 'undefined') {
                    callback();
                }
            }
        });
    }
    showSpinner() {
        this.spinner.css({
            opacity: 1
        });
        return this;
    }
    hideSpinner() {
        this.spinner.css({
            opacity: 0
        });
        return this;
    }
    collectData(form) {
        const data = new FormData(form);
        for (let key in this.options.extraData) {
            if (typeof this.options.extraData[key] == 'function') {
                data.append(key, this.options.extraData[key]());
            } else {
                data.append(key, this.options.extraData[key]);
            }
        }
        return data;
    }
    disable() {
        this.form.attr('disabled', 'disabled');
        this.form.find('input, textarea').attr('disabled', 'disabled');
        return this;
    }
    hideButton() {
        this.button.velocity({
            opacity: 0
        }, {
            duration: this.options.fadeSpeed,
            complete: () => {
                this.button.css({
                    visibility: 'hidden'
                });
            }
        });
    }
    clear() {
        for (let i in this.fields) {
            const current = this.fields[i];
            current.clear();
        }
        return this;
    }
    run() {
        this.bindFields();
        this.form.submit((e) => {
            e.preventDefault();
            if (!this.isWorking()) {
                this.startWorking();
                this.showSpinner();
                this.send();
            }
        })
    }
    send() {
        throw new Error("This method should be overwritten in the subclass.");
    }
}
Hawk.StaticFormSender = class extends Hawk.FormSender {
    constructor(form, fields, callback, options) {
        super(form, fields, options);
        this.callback = callback;
    }
    send() {
        this.callback(this);
    }
}
Hawk.AjaxFormSender = class extends Hawk.FormSender {
    constructor(form, fields, path, options) {
        super(form, fields, options);
        this.path = path;
    }
    send() {
        const data = this.collectData(this.form.get(0));
        $.ajax({
            url: this.path,
            type: 'POST',
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: (result) => {
                //console.log(result);
                if (result.status == Hawk.RequestStatus.SUCCESS) {
                    this.clear();
                    if (this.options.autoDisable) {
                        this.hideButton();
                        this.disable();
                    }
                    this.options.onCorrect(result);
                } else if (result.status == Hawk.RequestStatus.ERROR) {
                    this.options.onError(result);
                } else {
                    this.options.onException(result);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                //console.log(jqXHR.responseText);
                that.changeMessage("There occurred an unexpected error during processing the form. Please try again later.");
                //console.log(errorThrown);
                if (typeof this.options.onException == 'function') {
                    this.options.onException();
                }
            },
            complete: (jqXHR) => {
                this.spinner.hide();
                this.finishWorking();
            }
        });
    }
}
Hawk.AjaxOverlayerManager = class extends Hawk.SingleThreadClass {
    constructor(container, options) {
        super();
        this.container = $(container);
        this.overlayerID = this.container.attr('data-overlayer-id');
        this.open = false;
        this.body;
        this.lang;
        this.contentContainer;
        this.content;
        this.closeButton;
        this.defaultOptions = {
            path: "/ajax/load-overlayer",
            fadeSpeed: 200,
            slideSpeed: 200,
            wrapperClass: 'overlayer__wrapper',
            innerClass: 'overlayer__inner',
            contentContainerClass: 'overlayer__content-container',
            contentClass: 'overlayer__content',
            loadingLayerClass: 'overlayer__loading-layer',
            closeButtonClass: 'overlayer__close',
            onLoad: (aom, id, bundle) => {}
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    getOverlayerID() {
        return this.overlayerID;
    }
    getLang() {
        return this.lang;
    }
    getButtonsSelector() {
        return '.ajax-overlayer-button[data-overlayer-id="' + this.getOverlayerID() + '"]';
    }
    hide() {
        if (this.isWorking()) {
            this.abortRequest();
        }
        this.container.velocity("fadeOut", {
            duration: this.options.fadeSpeed,
            complete: () => {
                this.body.css({
                    overflow: 'auto'
                });
                this.contentContainer.hide();
                this.content.html("");
            }
        });
    }
    show() {
        this.container.velocity("fadeIn", {
            duration: this.options.fadeSpeed,
            complete: () => {
                this.body.css({
                    overflow: 'hidden'
                });
            }
        });
    }
    load(id, bundle) {
        if (!this.isWorking()) {
            this.startWorking();
            this.show();
            if (typeof bundle == 'undefined') {
                bundle = {};
            }
            this.setRequest($.ajax({
                type: "POST",
                url: this.options.path,
                dataType: "json",
                data: {
                    id: id,
                    bundle: bundle,
                    lang: this.getLang()
                },
                success: (result) => {
                    console.log(result);
                    if (result.status == Hawk.RequestStatus.SUCCESS) {
                        let finalCallback = () => {};
                        if (typeof this.options.onLoad == 'function') {
                            finalCallback = () => {
                                this.options.onLoad(this, id, result);
                            }
                        }
                        this.changeContent(result.html, finalCallback);
                    } else {
                        this.hide();
                    }
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // here should appear error layer
                    //alert(errorThrown);
                    console.log(jqXHR.responseText);
                },
                complete: () => {
                    this.finishWorking();
                }
            }));
        }
    }
    changeContent(content, callback) {
        this.content.css({
            opacity: 0
        });
        this.content.html(content);
        this.contentContainer.velocity("slideDown", {
            duration: this.options.slideSpeed,
            complete: () => {
                this.content.velocity({
                    opacity: 1
                }, {
                    duration: this.options.fadeSpeed,
                    complete: () => {
                        if (typeof callback == 'function') {
                            callback();
                        }
                    }
                });
            }
        });
    }
    onButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const jQueryThis = $(e.target);
        const id = jQueryThis.attr('data-id');
        const bundleString = jQueryThis.attr('data-bundle');
        this.load(id);
    }
    initializeClosePreventer() {
        this.container.on('click', '.' + this.options.contentContainerClass + ', .' + this.options.contentContainerClass + ':not(.' + this.options.closeButtonClass + ')', (e) => {
            e.stopPropagation();
            return;
        });
        return this;
    }
    run() {
        this.body = $('body');
        this.lang = $('html').attr('lang');
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.closeButton = this.container.find('.' + this.options.closeButtonClass);
        this.body.on('click', this.getButtonsSelector(), this.onButtonClick.bind(this));
        this.container.click((e) => {
            this.hide();
        });
        this.closeButton.click((e) => {
            this.hide();
        });
        this.initializeClosePreventer();
    }
}
export default Hawk;