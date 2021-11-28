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
        slideSpeed: 200,
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
    }
    this.showBaseLayer = function() {
        this.hideLayers();
        this.baseLayer.css({
            visibility: 'visible'
        });
        this.baseLayerInner.velocity({
            opacity: 1
        }, {});
    }
    this.hideLayers = function(except) {
        this.aboveLayers.not('[' + that.options.nameAttribute + '="' + except + '"]').velocity("fadeOut");
    }
    this.showLayer = function(name) {
        this.hideBaseLayer();
        this.hideLayers(name);
        var currentLayer = that.aboveLayers.filter('[' + that.options.nameAttribute + '="' + name + '"]');
        currentLayer.velocity("fadeIn", {
            complete: function() {
                // currentLayer.find('.' + that.options.aboveLayerInnerClass).css({
                //     opacity: 1
                // });
                that.options.onAboveLayerShow(that, currentLayer);
            }
        });
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
        console.log(this.buttons);
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
