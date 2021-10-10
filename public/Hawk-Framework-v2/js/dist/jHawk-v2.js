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
        mode: Hawk.DropdownConstants.Modes.PLAIN,
        type: Hawk.DropdownConstants.Types.OVERLAYER,
        direction: Hawk.DropdownConstants.Directions.DOWNWARDS,
        containerClass: 'hawk-dropdown',
        expandingTypeClass: 'hawk-dropdown--expanding',
        choosableModeClass: 'hawk-dropdown--choosable',
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
        onRadioSelected: function(dropdown, radio) {
            var description = radio.parent().find('.dropdown-item__description').html();
            dropdown.title.html(description);
            dropdown.hide();
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
        if (this.options.mode === Hawk.DropdownConstants.Modes.CHOOSABLE) {
            this.container.addClass(this.options.choosableModeClass);
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
