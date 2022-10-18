var Hawk = {};
Hawk = {
    w: window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
    h: window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
    anchorSuffix: '-anchor',
}
Hawk.RequestStatus = {
    SUCCESS: 0,
    ERROR: 1,
    EXCEPTION: 2
};
Hawk.getLocation = function() {
    return window.location;
}
Hawk.getPath = function() {
    return Hawk.getLocation().pathname;
}
Hawk.getHash = function() {
    return Hawk.getLocation().hash;
}
Hawk.anchorRegex = new RegExp("^[^\/]+$");
Hawk.getPreparedHash = function(withoutLeadingHashSign) {
    if (typeof withoutLeadingHashSign == 'undefined' || !withoutLeadingHashSign) {
        const regexp = new RegExp("[^a-zA-Z0-9\-_]+", 'g');
        return this.getHash().replaceAll(regexp, "");
    } else {
        return this.getHash().substring(1).replaceAll('/', '');
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
Hawk.createStringFromBundle = function(bundle) {
    var parts = [];
    for (var i in bundle) {
        console.log(i + "=" + bundle[i]);
        parts.push(i + "=" + bundle[i]);
    }
    return parts.join('&');
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
Hawk.scrollToElement = function(options) {
    const defaultOptions = {
        container: window,
        anchor: '#top' + Hawk.anchorSuffix,
        callback: function() {},
        delay: 0,
        duration: 800,
        offset: 0
    };
    options = Hawk.mergeObjects(defaultOptions, options);
    const offset = (typeof options.offset == 'function') ? options.offset() : options.offset;
    setTimeout(function() {
        $(options.container).scrollTo(options.anchor, options.duration, {
            'axis': 'y',
            'offset': offset,
            onAfter: function() {
                options.callback();
            }
        });
    }, options.delay);
    return this;
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
        onFailure: function() {},
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
        const onException = callbacks.onException || this.options.onException;
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
                onFailure(jqXHR.responseText);
            },
            complete: function() {
                that.ajaxRequestWorking = false;
                onComplete();
            }
        });
        return this;
    }
}
Hawk.AnchorsManager = class {
    constructor(options) {
        this.defaultOptions = {
            delay: 100,
            loadingDelay: 500,
            menu: undefined,
            anchorSuffix: Hawk.anchorSuffix,
            eventName: "click.anchorsManager",
            offset: function() {
                return 0;
            }
        }
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    getEventName() {
        return this.options.eventName;
    }
    getAnchorSuffix() {
        return this.options.anchorSuffix;
    }
    getAnchorOfHash(hash) {
        return hash + this.getAnchorSuffix();
    }
    goTo(anchor) {
        Hawk.scrollToElement({
            anchor: anchor + this.getAnchorSuffix(),
            offset: this.options.offset()
        });
    }
    isLinkBlank(link) {
        return typeof link.attr('data-anchor-type') != 'undefined' && link.attr('data-anchor-type') == 'blank';
    }
    movingAction(e) {
        const regex = /#{1}.+$/;
        const link = $(e.currentTarget);
        const href = link.attr('href');
        let anchor;
        let extraDelay = 0;
        if (anchor = regex.exec(href)) {
            const rawAnchor = anchor[0] + this.getAnchorSuffix();
            if ($(rawAnchor).length > 0) {
                e.preventDefault();
                if (typeof this.options.menu !== 'undefined' && link.parents().is(this.options.menu.menu)) {
                    extraDelay = this.options.menu.totalDuration();
                    this.options.menu.hide();
                }
                const finalDelay = this.options.delay + extraDelay;
                const callback = (!this.isLinkBlank(link)) ? function() {
                    window.location.hash = anchor;
                } : function() {};
                Hawk.scrollToElement({
                    anchor: rawAnchor,
                    callback: callback,
                    delay: finalDelay,
                    offset: this.options.offset()
                });
            }
        }
    }
    refresh() {
        $('a').unbind(this.getEventName(), this.movingAction).bind(this.getEventName(), this.movingAction.bind(this));
        return this;
    }
    run() {
        this.refresh();
        const currentHash = Hawk.getPreparedHash();
        if (currentHash.length > 0) {
            const preparedAnchor = this.getAnchorOfHash(currentHash);
            if ($(preparedAnchor).length > 0) {
                setTimeout(() => {
                    this.goTo(currentHash);
                }, this.options.loadingDelay);
            }
        }
    }
}
// Hawk.OldAnchorsManager = function(options) {
//     var that = this;
//     this.defaultOptions = {
//         delay: 100,
//         menu: undefined,
//         offset: function() {
//             return 0;
//         }
//     }
//     this.options = Hawk.mergeObjects(this.defaultOptions, options);
//     this.anchorsCallback = function(e) {
//         var regex = /#{1}.+$/;
//         var link = this;
//         var href = $(this).attr('href');
//         var anchor;
//         var extraDelay = 0;
//         if (anchor = regex.exec(href)) {
//             if ($(anchor + Hawk.anchorSufix).length) {
//                 e.preventDefault();
//                 if (typeof that.options.menu !== 'undefined' && $(link).parents().is(that.options.menu.menu)) {
//                     extraDelay = that.options.menu.totalDuration();
//                     that.options.menu.hide();
//                 }
//                 var finalDelay = that.options.delay + extraDelay;
//                 var callback = function() {
//                 }
//                 if (typeof $(link).attr('data-anchor-type') == 'undefined' || $(link).attr('data-anchor-type') != 'blank') {
//                     callback = function() {
//                         window.location.hash = anchor;
//                     }
//                 }
//                 Hawk.scrollToElement({ anchor: anchor + Hawk.anchorSufix, callback: callback, delay: finalDelay, offset: that.options.offset() });
//             }
//         }
//     };
//     this.goTo = function(anchor) {
//         Hawk.scrollToElement({ anchor: anchor + Hawk.anchorSufix, offset: that.options.offset() });
//     }
//     this.refresh = function() {
//         $('a').unbind('click', this.anchorsCallback).click(this.anchorsCallback);
//         return this;
//     }
//     this.run = function() {
//         this.refresh();
//     }
// }
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
        onSelected: function(dropdown, field) {
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
            return this.options.onSelected(this, field);
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
    this.refreshDependencies = function() {
        this.fields = this.list.find('input[type="radio"], input[type="checkbox"]');
        if (this.fields.length > 0) {
            this.fields.change(function() {
                if (typeof that.options.onSelected == 'function') {
                    that.options.onSelected(that, $(this));
                }
            });
        }
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
        this.refreshDependencies();
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
Hawk.Pager = class {
    constructor(container, options) {
        this.defaultOptions = {
            pagesVisibilityLimit: 8,
            visiblePagesNumber: 5,
            edgeVisiblePagesNumber: 4,
            activeClass: "active",
            pagesContainerClass: "hawk-pager__pages",
            previousButtonClass: "hawk-pager__previous",
            nextButtonClass: "hawk-pager__next",
            pagerItemClass: "pager-item",
            clickEventName: "click.pager",
            pageNrAttr: "data-page-nr",
            createItem: function(nr) {
                return $("<li class=\"std-pager__item\"><div class=\"pager-item\" data-page-nr=\"" + nr + "\">" + nr + "</div></li>");
            },
            createSeparator: function() {
                return $("<li class=\"std-pager__separator\"><div class=\"pager-item-separator\">...</div></li>");
            },
            onPageChanged: function(pager, nr) {}
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
        this.container = $(container);
        this.pagesContainer;
        this.controls = {};
        this.pagesNumber = 1;
        this.page = 1;
        this.pages;
    }
    getPage() {
        return this.page;
    }
    setPage(page) {
        this.page = page;
        return this;
    }
    updatePage(page) {
        this.setPage(page);
        this.markAsActive(page);
        if (this.shouldBeRebuilt(page)) {
            this.rebuild();
        } else {
            this.checkDependencies();
        }
        if (typeof this.options.onPageChanged == 'function') {
            this.options.onPageChanged(this, this.getPage());
        }
        return this;
    }
    getPagesNumber() {
        return this.pagesNumber;
    }
    setPagesNumber(pagesNumber) {
        this.pagesNumber = pagesNumber;
        return this;
    }
    checkDependencies() {
        if (this.isFirstPage()) {
            this.controls.previous.css({
                visibility: "hidden"
            });
        } else {
            this.controls.previous.css({
                visibility: "visible"
            });
        }
        if (this.isLastPage()) {
            this.controls.next.css({
                visibility: "hidden"
            });
        } else {
            this.controls.next.css({
                visibility: "visible"
            });
        }
        // if (typeof this.options.onPageChanged == 'function') {
        // 	this.options.onPageChanged(this, this.getPage());
        // }
    }
    previous() {
        return this.updatePage(this.getPage() - 1);
    }
    next() {
        return this.updatePage(this.getPage() + 1);
    }
    create(pagesNumber) {
        let pages = $();
        const page = this.getPage();
        if (pagesNumber <= this.options.pagesVisibilityLimit) {
            for (let i = 1; i <= pagesNumber; i++) {
                pages = pages.add(this.options.createItem(i));
            }
        } else if (this.isOnEdge(page)) {
            for (let i = 1; i <= this.options.edgeVisiblePagesNumber; i++) {
                pages = pages.add(this.options.createItem(i));
            }
            pages = pages.add(this.options.createSeparator());
            for (let i = pagesNumber - this.options.edgeVisiblePagesNumber + 1; i <= pagesNumber; i++) {
                pages = pages.add(this.options.createItem(i));
            }
        } else {
            pages = pages.add(this.options.createSeparator());
            let previousBound = page - Math.floor(this.options.visiblePagesNumber / 2);
            let rangeEnd = previousBound + this.options.visiblePagesNumber;
            for (let i = previousBound; i < rangeEnd; i++) {
                pages = pages.add(this.options.createItem(i));
            }
            pages = pages.add(this.options.createSeparator());
        }
        return pages;
    }
    isOnEdge(page) {
        return (page < this.options.edgeVisiblePagesNumber) || (page > (this.getPagesNumber() - this.options.edgeVisiblePagesNumber + 1));
    }
    isFirstPage() {
        return this.getPage() == 1;
    }
    isLastPage() {
        return this.getPage() == this.getPagesNumber();
    }
    isPageVisible(page) {
        return this.pages.find("[" + this.options.pageNrAttr + "=\"" + page + "\"]").length > 0;
    }
    shouldBeRebuilt(page) {
        return !this.isPageVisible(page) || !this.isPageVisible(page - 1) || !this.isPageVisible(page + 1);
    }
    build(pagesNumber) {
        this.setPagesNumber(pagesNumber);
        if (typeof this.pages != 'undefined') {
            this.pages.unbind(this.options.clickEventName);
        }
        this.pages = this.create(pagesNumber);
        this.pagesContainer.html('');
        this.pagesContainer.append(this.pages);
        this.pages.find('.' + this.options.pagerItemClass).bind('click', (e) => {
            e.preventDefault();
            const jQueryThis = $(e.currentTarget);
            const page = jQueryThis.attr(this.options.pageNrAttr);
            this.updatePage(page);
        });
        this.checkDependencies();
    }
    rebuild() {
        this.build(this.getPagesNumber());
        this.markAsActive(this.getPage());
    }
    markAsActive(nr) {
        this.pages.find('.' + this.options.pagerItemClass).removeClass(this.options.activeClass);
        this.pages.find('.' + this.options.pagerItemClass + "[" + this.options.pageNrAttr + "=\"" + nr + "\"]").addClass(this.options.activeClass);
    }
    run(pagesNumber) {
        this.pagesContainer = this.container.find('.' + this.options.pagesContainerClass);
        this.controls = {
            previous: this.container.find('.' + this.options.previousButtonClass),
            next: this.container.find('.' + this.options.nextButtonClass)
        };
        this.build(pagesNumber);
        this.markAsActive(this.getPage());
        this.controls.previous.click((e) => {
            this.previous();
        });
        this.controls.next.click((e) => {
            this.next();
        });
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
Hawk.AjaxItemsManager = class extends Hawk.SingleThreadClass {
    constructor(container, options) {
        super();
        this.container = $(container);
        this.contentContainer;
        this.loadingLayer;
        this.page = 1;
        this.allItemsAmount = 0;
        this.filters = {};
        this.categories = [];
        this.pagers = [];
        this.defaultOptions = {
            path: "ajax/load-page",
            itemsPerPage: 12,
            itemClass: "ajax-items-manager__item",
            contentContainerClass: "ajax-items-manager__content-container",
            filterLabelClass: "ajax-items-manager__filter",
            slideSpeed: 400,
            fadeSpeed: 400,
            updateContent: function(contentContainer, items) {
                contentContainer.html(items);
            },
            createFilterLabel: (type, value, description) => {
                return "<div class=\"" + this.options.filterLabelClass + "\">" + description + "</div>"
            },
            onLoad: function(result, contentContainer, firstLoading) {},
            onError: function(contentContainer) {}
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    addFilter(type, value) {
        if (typeof this.filters[type] == 'undefined') {
            this.filters[type] = [];
        }
        this.filters[type].push(value);
    }
    removeFilter(type, value) {
        if (typeof this.filters[type] != 'undefined') {
            let currentFilter = this.filters[type];
            for (let i in currentFilter) {
                if (currentFilter[i] == value) {
                    currentFilter.splice(i, 1);
                    this.removeFilterLabel(type, value);
                    return;
                }
            }
        }
    }
    createFilterLabel(type, value, description) {
        return this.options.createFilterLabel(type, value, description);
    }
    removeFilterLabel(type, value) {
        this.container.find('.' + this.options.filterLabelClass).filter(function() {
            return $(this).attr('data-type') == type;
        }).filter(function() {
            return $(this).attr('data-id') == value;
        }).remove();
    }
    setPage(page) {
        this.page = page;
        return this;
    }
    getPage() {
        return this.page;
    }
    setAllItemsAmount(allItemsAmount) {
        this.allItemsAmount = allItemsAmount;
        return this;
    }
    getAllItemsAmount() {
        return this.allItemsAmount;
    }
    getPagesNumber() {
        return Math.ceil(this.allItemsAmount / this.options.itemsPerPage);
    }
    addPager(pager) {
        this.pagers.push(pager);
        return this;
    }
    doPagersAction(action) {
        for (const pager of this.pagers) {
            action(pager);
        }
    }
    refreshPagers() {
        this.doPagersAction((pager) => {
            pager.setPagesNumber(this.getPagesNumber());
            pager.updatePage(this.getPage());
        });
    }
    updateContent(content) {
        this.options.updateContent(this.contentContainer, content);
    }
    load(page, firstLoading) {
        this.setPage(page);
        console.log("AjaxItemsManager::load()");
        console.log(firstLoading);
        if (typeof firstLoading == 'undefined') {
            firstLoading = false;
        }
        if (!this.isWorking()) {
            this.startWorking();
            this.setRequest($.ajax({
                type: "POST",
                url: this.options.path,
                dataType: "json",
                data: {
                    'page': this.page,
                    'itemsPerPage': this.options.itemsPerPage,
                    'filters': this.filters
                },
                success: (result) => {
                    console.log(result);
                    if (result.status == Hawk.RequestStatus.SUCCESS) {
                        this.setAllItemsAmount(result.allItemsAmount);
                        this.setPage(result.page);
                        this.refreshPagers();
                        //this.makePageActive(this.getPage());
                        this.updateContent(result.html);
                    }
                    this.options.onLoad(result, this.contentContainer, firstLoading);
                },
                error: (jqXHR, textStatus, errorThrown) => {
                    console.warn(jqXHR.responseText);
                },
                complete: () => {
                    this.finishWorking();
                }
            }));
        }
    }
    reload() {
        this.load(this.getPage());
    }
    run(page) {
        if (typeof page == 'undefined') {
            page = 1;
        }
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.load(page, true);
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
    getField() {
        return this.field;
    }
    getName() {
        return this.name;
    }
    getWrapper() {
        return this.wrapper;
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
Hawk.FileFormField = class extends Hawk.FormField {
    constructor(name, options) {
        super(name, options);
    }
    getValue() {
        return this.field.val();
    }
    validate() {
        return this.options.validate(this.getField(), this.getWrapper());
    }
    initializeObserving() {
        this.field.change(() => {
            setTimeout(() => {
                this.checkField();
            }, 10);
        });
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
        this.field.change(() => {
            this.checkField();
        });
    }
}
Hawk.ChoiceFormField = class extends Hawk.FormField {
    constructor(name, options) {
        super(name, options);
    }
    getValue() {
        return this.field.val();
    }
    validate() {
        return this.options.validate(this.getField());
    }
    initializeObserving() {
        this.field.change(() => {
            this.checkField();
        });
    }
}
Hawk.TextareaFormField = class extends Hawk.FormField {
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
        this.field.change(() => {
            this.checkField();
        });
    }
    bind(form) {
        this.field = $(form).find('textarea[name="' + this.getName() + '"]');
        this.wrapper = this.options.obtainWrapper(this.field);
        return this.isBinded();
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
        this.defaultOptions = this.getDefaultOptions();
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
        this.infoContainer = this.form.find('.' + this.options.infoContainerClass);
        this.infoWrapper = this.form.find('.' + this.options.infoWrapperClass);
        this.info = this.form.find('.' + this.options.infoClass);
        this.spinner = this.form.find('.' + this.options.spinnerClass);
        this.button = this.options.obtainButton(this.form);
        this.cancelButton = this.options.obtainCancelButton(this.form);
    }
    getDefaultOptions() {
        return {
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
            onSuccess: (result) => {
                this.defaultResultCallback(result);
            },
            onError: (result) => {
                this.defaultResultCallback(result);
            },
            onException: (result) => {
                if (typeof result != 'undefined') {
                    this.defaultResultCallback(result);
                }
            },
            onComplete: (result) => {}
        };
    }
    defaultResultCallback(result) {
        this.checkFields(result.errorFields);
        this.changeMessage("<p class=\"failure\">" + result.message + "</p>");
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
    clearMessage() {
        this.hideMessage(() => {
            this.info.html("");
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
            this.submit();
        });
    }
    submit() {
        if (!this.isWorking()) {
            this.startWorking();
            this.showSpinner();
            this.send();
        }
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
    getDefaultOptions() {
        let defaultOptions = super.getDefaultOptions();
        defaultOptions.method = "POST";
        return defaultOptions;
    }
    send() {
        const data = this.collectData(this.form.get(0));
        $.ajax({
            url: this.path,
            type: this.options.method,
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: (result) => {
                console.log(result);
                if (result.status == Hawk.RequestStatus.SUCCESS) {
                    this.clear();
                    if (this.options.autoDisable) {
                        this.hideButton();
                        this.disable();
                    }
                    this.options.onSuccess(result);
                } else if (result.status == Hawk.RequestStatus.ERROR) {
                    this.options.onError(result);
                } else {
                    this.options.onException(result);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseText);
                this.changeMessage("There occurred an unexpected error during processing the form. Please try again later.");
                //console.log(errorThrown);
                if (typeof this.options.onException == 'function') {
                    this.options.onException();
                }
            },
            complete: (jqXHR) => {
                this.hideSpinner();
                this.finishWorking();
            }
        });
    }
}
Hawk.ComponentsConstants = {
    COMPONENT_ID_ATTRIBUTE: "data-hawk-component-id",
    COMPONENT_CLASS_ID_ATTRIBUTE: "data-hawk-component-class"
}
Hawk.Component = class {
    constructor(id) {
        this.id = id || -1;
        this.values = {};
        this.properties = {};
        this.methods = {};
        this.subcomponents = {};
    }
    getClassID() {
        throw new Error("This method should be overwritten in the subclass.");
    }
    getClassname() {
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
            return $('.' + this.getClassname() + '[' + Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE + '="' + this.getID() + '"]');
        } else {
            return $('.' + this.getClassname());
        }
    }
    getElement(name) {
        if (this.getID() != -1) {
            return this.getContainer().find('.' + this.getClassname() + '__' + name).filter((index, current) => {
                const parents = $(current).parents('.' + this.getClassname());
                return parents.eq(0).attr(Hawk.ComponentsConstants.COMPONENT_ID_ATTRIBUTE) == this.getID();
            });
        } else {
            return this.getContainer().find('.' + this.getClassname() + '__' + name);
        }
    }
    addSubcomponent(subcomponent) {
        if (typeof this.subcomponents[subcomponent.getClassID()] == 'undefined') {
            this.subcomponents[subcomponent.getClassID()] = [];
        }
        this.subcomponents[subcomponent.getClassID()].push(subcomponent);
    }
    placeSubcomponent(subcomponent, html) {
        const subcomponentsContainer = this.getElement('subcomponents').filter('[' + Hawk.ComponentsConstants.COMPONENT_CLASS_ID_ATTRIBUTE + '="' + subcomponent.getClassID() + '"]');
        this.addSubcomponent(subcomponent);
        const subcomponentHTML = $(html);
        subcomponentHTML.css({
            display: 'none'
        });
        subcomponentsContainer.append(subcomponentHTML);
        subcomponent.refreshView();
        subcomponentHTML.velocity("slideDown");
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
            for (let j in this.subcomponents[i]) {
                console.log(this.subcomponents[i][j].getID());
                //if (this.subcomponents[i][j].hasOwnProperty('refreshView')) {
                this.subcomponents[i][j].refreshView();
                //}
            }
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
                    console.log(instance);
                    this.options.onComponentsLoad(this);
                } else if (result.status == Hawk.RequestStatus.ERROR) {} else {}
            },
            error: (jqXHR, textStatus, errorThrown) => {
                console.log(jqXHR.responseText);
                //console.log(errorThrown);
            },
            complete: (jqXHR) => {}
        });
    }
}
Hawk.DetailsList = class extends Hawk.SingleThreadClass {
    constructor(container, options) {
        super();
        this.container = $(container);
        this.current = null;
        this.headers = null;
        this.options = {};
        this.defaultOptions = {
            itemClass: "hawk-details-list__item",
            headerClass: "hawk-details-list__header",
            contentContainerClass: "hawk-details-list__content-container",
            contentClass: "hawk-details-list__content",
            activeClass: "active",
            eventName: "click.detailsList",
            autoHide: true,
            getContentContainer: (header) => {
                return header.siblings('.' + this.options.contentContainerClass);
            },
            getParent: (element) => {
                return element.parents('.' + this.options.itemClass);
            },
            slideSpeed: 200,
            fadeSpeed: 200,
            onShow: (dl, header, contentContainer) => {
                header.find('.details-list-item__icon').removeClass('icon-arrow--south').addClass('icon-arrow--north');
            },
            onHide: (dl, header, contentContainer) => {
                header.find('.details-list-item__icon').removeClass('icon-arrow--north').addClass('icon-arrow--south');
            }
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    show(header) {
        if (this.options.autoHide && this.current != null) {
            this.hide(this.current);
        }
        this.current = header;
        const contentContainer = this.options.getContentContainer(header);
        contentContainer.velocity("slideDown", {
            duration: this.options.slideSpeed,
            complete: () => {
                this.finishWorking();
            }
        });
        const parent = this.options.getParent(header);
        parent.addClass(this.options.activeClass);
        this.options.onShow(this, header, contentContainer);
    }
    showByIndex(index) {}
    hide(header) {
        const contentContainer = this.options.getContentContainer(header);
        contentContainer.velocity("slideUp", {
            duration: this.options.slideSpeed,
            complete: () => {
                this.finishWorking();
            }
        });
        const parent = this.options.getParent(header);
        parent.removeClass(this.options.activeClass);
        this.options.onHide(this, header, contentContainer);
    }
    toggle(header) {
        if (!this.isWorking()) {
            this.startWorking();
            const contentContainer = this.options.getContentContainer(header);
            if (contentContainer.is(':visible')) {
                this.hide(header);
            } else {
                this.show(header);
            }
        }
    }
    refreshDependencies() {
        if (this.headers != null) {
            this.headers.unbind(this.options.eventName);
        }
        const that = this;
        this.headers = this.container.find('.' + this.options.headerClass);
        this.headers.bind(this.options.eventName, (e) => {
            const header = $(e.currentTarget);
            this.toggle(header);
        });
    }
    run() {
        this.refreshDependencies();
    }
}
Hawk.AjaxOverlayerManagerConstants = {
    modes: {
        DEFAULT: 0,
        DELEGATE_EVENTS: 1
    },
    getDefaultHashPattern: () => {
        return "^o\/[0-9]+\/[a-zA-Z\-_0-9]+\/[a-zA-Z\-_0-9]+\/(((&)*[a-zA-Z0-9]+=[a-zA-Z0-9]+)*)?$";
    }
};
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
        this.buttons;
        this.closeButton;
        this.defaultOptions = {
            path: "/ajax/load-overlayer",
            fadeSpeed: 200,
            slideSpeed: 200,
            mode: Hawk.AjaxOverlayerManagerConstants.modes.DEFAULT,
            eventName: 'click.ajaxOverlayerManager',
            popstateEventName: 'popstate.ajaxOverlayerManager',
            wrapperClass: 'overlayer__wrapper',
            innerClass: 'overlayer__inner',
            contentContainerClass: 'overlayer__content-container',
            contentClass: 'overlayer__content',
            loadingLayerClass: 'overlayer__loading-layer',
            closeButtonClass: 'ajax-overlayer-close',
            onLoad: (aom, id, result) => {},
            onShow: (aom) => {},
            onHide: (aom) => {},
            onInitialize: (aom, hash) => {
                if (hash.length > 0) {
                    if (hash.startsWith("#")) {
                        hash = hash.substring(1);
                    }
                    const regexp = new RegExp(Hawk.AjaxOverlayerManagerConstants.getDefaultHashPattern());
                    if (regexp.test(hash)) {
                        const parts = hash.split('/');
                        if (parts[1] == aom.getOverlayerID()) {
                            const id = parts[2];
                            var bundle = {};
                            if (typeof parts[4] != 'undefined') {
                                bundle = Hawk.createBundleFromString(parts[4]);
                            }
                            aom.load(id, bundle);
                        }
                    }
                }
            }
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
        this.options.onHide(this);
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
        this.clearHash();
        $(window).unbind(this.options.popstateEventName);
    }
    show() {
        this.options.onShow(this);
        this.container.velocity("fadeIn", {
            duration: this.options.fadeSpeed,
            complete: () => {
                this.body.css({
                    overflow: 'hidden'
                });
            }
        });
    }
    isOpen() {
        return this.container.is(":visible");
    }
    load(id, bundle) {
        if (!this.isOpen()) {
            this.show();
        } else {
            $(window).unbind(this.options.popstateEventName);
        }
        this.loadContent(id, bundle);
    }
    loadContent(id, bundle) {
        if (!this.isWorking()) {
            this.startWorking();
            if (typeof bundle == 'undefined') {
                bundle = {};
            }
            this.loadingLayer.css({
                display: 'flex'
            });
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
                    if (typeof result.anchor != 'undefined') {
                        this.setHash(this.createAnchor(result.anchor, bundle));
                    }
                    $(window).bind(this.options.popstateEventName, (e) => {
                        this.hide();
                    });
                },
                error: function(jqXHR, textStatus, errorThrown) {
                    // here should appear error layer
                    //alert(errorThrown);
                    console.log(jqXHR.responseText);
                },
                complete: () => {
                    this.finishWorking();
                    this.loadingLayer.css({
                        display: 'none'
                    });
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
    clearHash() {
        //history.pushState("", document.title, window.location.pathname + window.location.search);
    }
    setHash(hash) {
        //history.pushState("", document.title, window.location.pathname + window.location.search);
        window.location.hash = '#' + hash;
        return this;
    }
    createAnchor(anchor, bundle) {
        let resultAnchor = "o/" + this.getOverlayerID() + "/" + anchor;
        if (typeof bundle != 'undefined') {
            resultAnchor += "/" + Hawk.createStringFromBundle(bundle);
        }
        return resultAnchor;
    }
    onButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();
        const jQueryThis = $(e.currentTarget);
        const id = jQueryThis.attr('data-id');
        var bundleString;
        if (typeof jQueryThis.attr('data-bundle') != 'undefined') {
            bundleString = Hawk.createBundleFromString(jQueryThis.attr('data-bundle'));
        } else {
            bundleString = {};
        }
        this.load(id, bundleString);
    }
    initializeClosePreventer() {
        this.container.on('click', '.' + this.options.contentContainerClass + ', .' + this.options.contentContainerClass + ':not(.' + this.options.closeButtonClass + ')', (e) => {
            e.stopPropagation();
            return;
        });
        return this;
    }
    refreshDependencies() {
        if (this.options.mode == Hawk.AjaxOverlayerManagerConstants.modes.DELEGATE_EVENTS) {
            this.body.on('click', this.getButtonsSelector(), this.onButtonClick.bind(this));
        } else {
            if (typeof this.buttons != 'undefined') {
                this.buttons.unbind(this.options.eventName);
            }
            this.buttons = $(this.getButtonsSelector());
            this.buttons.bind(this.options.eventName, this.onButtonClick.bind(this));
        }
    }
    run() {
        this.body = $('body');
        this.lang = $('html').attr('lang');
        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.closeButton = this.container.find('.' + this.options.closeButtonClass);
        this.loadingLayer = this.container.find('.' + this.options.loadingLayerClass);
        //this.body.on('click', this.getButtonsSelector(), this.onButtonClick.bind(this));
        this.refreshDependencies();
        this.container.click((e) => {
            this.hide();
            history.pushState("", document.title, window.location.pathname + window.location.search);
        });
        this.container.on('click', '.' + this.options.closeButtonClass, (e) => {
            this.hide();
            history.pushState("", document.title, window.location.pathname + window.location.search);
        });
        this.initializeClosePreventer();
        this.options.onInitialize(this, Hawk.getHash());
    }
}
Hawk.SectionDetector = class {
    constructor(element, sections, options) {
        this.element = $(element);
        this.sections = sections;
        this.scrollY = 0;
        this.defaultOptions = {
            offset: 0,
            onSectionInRange: (sectionDetector, sectionInRange) => {}
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    getScrollY() {
        return this.scrollY;
    }
    getElementBottomEdge() {
        return this.element.position().top + this.element.outerHeight();
    }
    getElementTopEdge() {
        return this.element.position().top;
    }
    getElementLeftEdge() {
        return this.element.position().left;
    }
    getSectionBottomEdge(section) {
        return section.offset().top + section.outerHeight() - this.getScrollY();
    }
    getSectionLeftEdge(section) {
        return section.offset().left;
    }
    getSectionRightEdge(section) {
        return section.offset().left + section.outerWidth();
    }
    getSectionTopEdge(section) {
        return section.offset().top - this.getScrollY();
    }
    checkIfSectionInRange(section) {
        return this.getSectionTopEdge(section) <= this.getElementTopEdge() && this.getSectionLeftEdge(section) <= this.getElementLeftEdge() && this.getSectionRightEdge(section) > this.getElementLeftEdge() && this.getSectionBottomEdge(section) >= this.getElementBottomEdge();
    }
    checkSections() {
        const that = this;
        this.sections.each(function() {
            // console.log();
            // console.log("____________________________________");
            // console.log("scrollTop: " + that.getScrollY());
            // console.log("Element top: " + that.getElementTopEdge());
            // console.log("Element bottom: " + that.getElementBottomEdge());
            if (that.checkIfSectionInRange($(this))) {
                // console.log($(this).attr('class') + " offset top:::::::::: " + $(this).offset().top);
                // console.log($(this).attr('class') + " top edge:::::::: " + that.getSectionTopEdge($(this)));
                // console.log($(this).attr('class') + " bottom edge::::::::: " + that.getSectionBottomEdge($(this)));
                that.options.onSectionInRange(that, $(this));
            }
            // else if ($(this).hasClass('section-08')) {
            // 	console.log($(this).attr('class') + " offset top: " + $(this).offset().top);
            // 	console.log($(this).attr('class') + " top edge: " + that.getSectionTopEdge($(this)));
            // 	console.log($(this).attr('class') + " bottom edge: " + that.getSectionBottomEdge($(this)));
            // }
        });
    }
    run() {
        $(window).scroll((e) => {
            this.scrollY = $(window).scrollTop();
            this.checkSections();
        });
        //setTimeout(() => {
        this.scrollY = $(window).scrollTop();
        this.checkSections();
        //}, 200);
    }
}
Hawk.BookmarksManager = function(container, options) {
    this.container = $(container);
    this.content;
    this.contentWrapper;
    this.bookmarks;
    this.current; // current bookmark container
    this.currentHeight = 0;
    this.currentWidth;
    this.loading = false;
    var that = this;
    this.defaultOptions = {
        responsive: true,
        activeScroll: false,
        activeScrollWidth: 480,
        slideDuration: 200,
        fadeDuration: 200,
        activeBookmarkClass: "active",
        bookmarksClass: "bookmarks-manager__bookmark-container",
        contentClass: "bookmarks-manager__content",
        contentWrapperClass: "bookmarks-manager__content-wrapper",
        bookmarkClass: "bookmarks-manager__bookmark",
        bookmarkContentClass: "bookmarks-manager__bookmark-content",
        bookmarkActiveCallback: function(bookmarkContainer) {},
        bookmarkUnactiveCallback: function(bookmarkContainer) {},
        changeContentCallback: function(content) {},
        changeBookmarkCallback: function(bookmarkContainer) {},
        changeHashCallback: function(hash) {},
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.isResponsive = function() {
        return this.options.responsive;
    };
    this.isSmallDevice = function() {
        return this.isResponsive() && !this.content.is(":visible");
    };
    this.changeContent = function(content, callback, outerContainer) {
        var container;
        if (outerContainer === undefined) {
            container = this.content;
        } else container = outerContainer;
        var showing = function() {
            container.hide();
            container.html(content.show());
            container.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    container.velocity({
                        opacity: 1
                    }, {
                        duration: that.options.fadeDuration,
                        complete: function() {
                            var currentHeight = that.content.outerHeight();
                            that.currentHeight = currentHeight;
                            that.contentWrapper.css({
                                "min-height": that.currentHeight + "px",
                            });
                            that.options.changeContentCallback(that.content);
                            if (typeof callback == "function") callback();
                            that.loading = false;
                        },
                    });
                },
            });
        };
        if (container.css("opacity") != 0) {
            container.velocity({
                opacity: 0
            }, {
                duration: that.options.fadeDuration,
                complete: function() {
                    container.html("");
                    showing();
                },
            });
        } else {
            showing();
        }
        if (this.options.activeScroll && Hawk.w < this.options.activeScrollWidth) {
            var id = this.content.attr("id");
            if (id !== undefined) {
                Hawk.scrollToElement({
                    anchor: "#" + id
                });
            }
        }
        return this;
    };
    this.changeBookmark = function(bookmarkContainer) {
        this.unsetBookmarkActive();
        this.current = bookmarkContainer;
        var bookmark = this.current.find("." + this.options.bookmarkClass);
        var content = this.current.find("." + this.options.bookmarkContentClass);
        this.setBookmarkActive(this.current);
        if (this.isSmallDevice()) {
            content.velocity("slideDown", {
                duration: that.options.slideDuration,
                complete: function() {
                    that.options.changeContentCallback(content);
                    that.loading = false;
                },
            });
        } else {
            this.changeContent(content.clone(true));
        }
        return this;
    };
    this.unsetBookmarkActive = function() {
        if (this.current !== undefined) {
            var current = this.current;
            current.find("." + this.options.bookmarkClass).removeClass(this.options.activeBookmarkClass);
            current.find("." + this.options.bookmarkContentClass).velocity("slideUp", {
                duration: that.options.slideDuration,
            });
            this.current = undefined;
            this.options.bookmarkUnactiveCallback(current);
        }
        return this;
    };
    this.setBookmarkActive = function(bookmarkContainer) {
        var bookmark = bookmarkContainer.find("." + this.options.bookmarkClass);
        bookmark.addClass(this.options.activeBookmarkClass);
        this.options.bookmarkActiveCallback(bookmarkContainer);
        return this;
    };
    this.launchBookmark = function(n) {
        this.changeBookmark(this.bookmarks.eq(n));
        return this;
    };
    this.updateOptions = function(options) {
        this.options = Hawk.mergeObjects(this.options, options);
        return this;
    };
    this.clear = function(callback) {
        //this.current = undefined;
        this.unsetBookmarkActive();
        this.content.velocity({
            opacity: 0
        }, {
            duration: 200,
            complete: function() {
                if (callback !== undefined) {
                    callback();
                }
            },
        });
        return this;
    };
    this.remindActiveBookmark = function() {
        if (this.isSmallDevice()) {}
        return this;
    };
    this.launchBookmarkByName = function(name) {
        var finalName = name;
        this.bookmarks.each(function() {
            var current = $(this);
            if (current.attr("data-hash") == finalName) {
                that.changeBookmark(current);
                return;
            }
        });
    };
    this.refresh = function() {
        var current = this.current;
        if (current !== undefined) {
            this.clear(function() {
                that.changeBookmark(current);
            });
        }
        return this;
    };
    this.run = function() {
        this.bookmarks = this.container.find("." + this.options.bookmarksClass);
        this.content = this.container.find("." + this.options.contentClass);
        this.contentWrapper = this.container.find("." + this.options.contentWrapperClass);
        var refresh;
        this.currentWidth = Hawk.w;
        $(window).resize(function() {
            if (Hawk.w != that.currentWidth) {
                clearTimeout(refresh);
                refresh = setTimeout(function() {
                    that.refresh();
                    that.currentWidth = Hawk.w;
                }, 100);
            }
        });
        var hash = window.location.hash;
        if (hash.length > 0) {
            hash = hash.substr(1);
            console.log(hash);
            var chosenBookmark = this.bookmarks.filter('[data-hash="' + hash + '"]');
            if (chosenBookmark.length > 0) {
                this.launchBookmarkByName(hash);
                this.options.changeHashCallback(hash);
            } else {
                this.launchBookmark(0);
            }
        } else {
            this.launchBookmark(0);
        }
        this.bookmarks.click(function() {
            if (that.loading == true) {
                return;
            }
            if (that.current !== undefined && that.current.is($(this))) {
                that.remindActiveBookmark();
            } else {
                that.changeBookmark($(this));
                that.loading = true;
            }
        });
        return this;
    };
};
Hawk.SlideMenu = function(id, options) {
    this.menu = $('#' + id);
    this.wrapper = this.menu.find('> div');
    this.mode;
    this.direction;
    this.state;
    this.toggler;
    this.close;
    this.directionClassName;
    this.modeClassName;
    this.openClassName;
    this.states = {
        closed: 'closed',
        open: 'open'
    };
    this.modes = {
        slideFade: 'slide-fade',
        slide: 'slide',
        fade: 'fade',
        radial: 'radial'
    };
    this.directions = {
        top: 'top',
        right: 'right',
        bottom: 'bottom',
        left: 'left'
    };
    this.defaultOptions = {
        slideDuration: 500,
        fadeDuration: 500,
        direction: 'top',
        mode: 'slide',
        toggler: $('.menu-toggler'),
        close: this.menu.find('.menu-close'),
        mainClass: 'slide-menu',
        showCallback: function(menu) {},
        hideCallback: function(menu, hideCall) {
            hideCall();
        }
    };
    this.options = Hawk.mergeObjects(this.defaultOptions, options);
    this.show = function() {
        var that = this;
        var timeRemaining = this.totalDuration();
        that.options.showCallback(that.menu);
        // setTimeout(function() {
        //     that.options.showCallback(that.menu);
        // }, timeRemaining);
        if (this.options.mode == this.modes.fade) {
            this.menu.velocity("fadeIn", {
                duration: this.options.fadeDuration
            });
        }
        this.menu.addClass(this.openClassName);
        this.state = this.states.open;
        this.toggler.addClass('open');
        this.toggler.find('.icon-hamburger').addClass('open');
        return this;
    }
    this.hide = function() {
        var that = this;
        this.options.hideCallback(this.menu, function() {
            if (that.options.mode == that.modes.fade) {
                that.menu.velocity("fadeOut", {
                    duration: that.options.fadeDuration
                });
            }
            that.menu.removeClass(that.openClassName);
        });
        this.state = this.states.closed;
        this.options.toggler.removeClass('open');
        this.options.toggler.find('.icon-hamburger').removeClass('open');
        return this;
    }
    this.totalDuration = function() {
        if (this.options.mode == this.modes.slide) {
            return this.options.slideDuration;
        } else if (this.options.mode == this.modes.slideFade) {
            return this.options.slideDuration + this.options.fadeDuration;
        } else if (this.options.mode == this.modes.fade) {
            return this.options.fadeDuration;
        } else {
            return 0;
        }
    }
    this.run = function() {
        var that = this;
        this.toggler = this.options.toggler;
        this.close = this.options.close;
        this.modeClassName = this.options.mainClass + "--" + this.options.mode;
        this.directionClassName = this.options.mainClass + "--" + this.options.direction;
        this.openClassName = this.options.mainClass + "--open";
        this.menu.addClass(this.directionClassName);
        this.menu.addClass(this.modeClassName);
        this.hide();
        this.toggler.click(function() {
            if (that.state == that.states.open) {
                that.hide();
            } else {
                that.show();
            }
        });
        this.close.click(function() {
            that.hide();
        });
        return this;
    }
}
Hawk.Routes = {
    routes: {},
    path: Hawk.getPath(),
    regexp: new RegExp(""),
    is: function(route) {
        this.regexp = new RegExp(route);
        return this.regexp.test(Hawk.getPath());
    },
    contains: function(parameterName) {
        var regexp = new RegExp('/' + parameterName + '/');
        var endRegexp = new RegExp('/' + parameterName + '$');
        return regexp.test(Hawk.getPath()) || endRegexp.test(Hawk.getPath());
    },
    getParameterValue: function(parameterString) {
        var parts = parameterString.split('/');
        if (parts.length > 2) {
            return parts[2];
        } else {
            return null;
        }
    },
    get: function(parameterName) {
        if (this.contains(parameterName)) {
            var pattern = '/' + parameterName + '/([0-9a-zA-Z\-]+)';
            var regexp = new RegExp(pattern + '/');
            var endRegexp = new RegExp(pattern + '$');
            var results = regexp.exec(Hawk.getPath());
            if (results != null) {
                return this.getParameterValue(results[0]);
            } else {
                results = endRegexp.exec(Hawk.getPath());
                if (results != null) {
                    return this.getParameterValue(results[0]);
                } else {
                    return null;
                }
            }
        } else {
            return null;
        }
    }
}
Hawk.RevealingItem = class {
    constructor(container, options) {
        this.container = container;
        this.defaultOptions = {
            baseItemClass: 'pulling-item__base-item',
            layerItemClass: 'pulling-item__layer-item',
            afterItemClass: 'pulling-item__after-item',
            barClass: 'pulling-item__pulling-bar'
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
        this.currentDelta = 0;
        this.leftOffset = 0;
        this.maxWidth = 0;
    }
    getWidth() {
        return this.layerItem.width();
    }
    countDelta(pageX) {
        var delta = pageX - (this.leftOffset + this.getWidth());
        this.currentDelta = delta;
        return this.currentDelta;
    }
    pulling(e) {
        var pageX = (e.type.toLowerCase() === 'mousemove') ? e.pageX : e.originalEvent.touches[0].pageX;
        var width = pageX - this.leftOffset;
        this.layerItem.css({
            width: width + "px"
        });
        var afterItemWidth = this.baseItem.width() - width;
        this.afterItem.css({
            width: afterItemWidth + "px"
        });
    }
    startPulling() {
        $('body').bind('mousemove.revealingItem touchmove.revealingItem', this.pulling.bind(this));
    }
    finishPulling() {
        $('body').unbind('mousemove.revealingItem touchmove.revealingItem');
    }
    refresh() {
        this.leftOffset = this.layerItem.offset().left;
    }
    run() {
        this.baseItem = this.container.find('.' + this.options.baseItemClass);
        this.layerItem = this.container.find('.' + this.options.layerItemClass);
        this.afterItem = this.container.find('.' + this.options.afterItemClass);
        this.bar = this.container.find('.' + this.options.barClass);
        console.log('lalala');
        console.log(this.options.layerItemClass);
        console.log(this.layerItem);
        this.refresh();
        $(window).resize(() => {
            this.refresh();
        })
        $('body').bind('mouseup touchend', (e) => {
            console.log('finishing pulling?');
            this.finishPulling();
        });
        $('body').bind('mousedown touchstart', (e) => {
            var pageY = (e.type.toLowerCase() === 'mousedown') ? e.pageY : e.originalEvent.touches[0].pageY;
            var pageX = (e.type.toLowerCase() === 'mousedown') ? e.pageX : e.originalEvent.touches[0].pageX;
            if (pageY > this.bar.offset().top && pageY < (this.bar.offset().top + this.bar.height()) && pageX > this.bar.offset().left && pageX < (this.bar.offset().left + this.bar.width())) {
                this.startPulling();
            }
        });
    }
}
Hawk.Countdown = class Countdown {
    constructor(container, targetDate, options) {
        this.container = $(container);
        this.targetDate = targetDate;
        this.interval;
        this.finished = false;
        this.defaultOptions = {
            valueClassNames: {
                hours: 'hawk-countdown__hours',
                minutes: 'hawk-countdown__minutes',
                seconds: 'hawk-countdown__seconds'
            },
            captionClassNames: {
                hours: 'hawk-countdown__hours-caption',
                minutes: 'hawk-countdown__minutes-caption',
                seconds: 'hawk-countdown__seconds-caption'
            },
            unitForms: {
                hours: {
                    'single': "hour",
                    'many': "hours"
                },
                minutes: {
                    'single': "minute",
                    'many': "minutes"
                },
                seconds: {
                    'single': "second",
                    'many': "seconds"
                }
            },
            onTargetReached: (countdown) => {}
        };
        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }
    getCurrentTime() {
        return new Date();
    }
    getTimeDifference() {
        const now = this.getCurrentTime();
        let timeDifference = this.targetDate.getTime() - now.getTime();
        if (timeDifference > 0) {
            const hours = Math.floor(timeDifference / 1000 / 60 / 60);
            timeDifference -= hours * 1000 * 60 * 60;
            const minutes = Math.floor(timeDifference / 1000 / 60);
            timeDifference -= minutes * 1000 * 60;
            const seconds = Math.floor(timeDifference / 1000);
            return {
                hours: hours,
                minutes: minutes,
                seconds: seconds
            };
        } else {
            return {
                hours: 0,
                minutes: 0,
                seconds: 0
            };
        }
    }
    isTargetReached(timeLeft) {
        return timeLeft.hours == 0 && timeLeft.minutes == 0 && timeLeft.seconds == 0;
    }
    update() {
        const timeLeft = this.getTimeDifference();
        this.values.hours.html(Hawk.addZeros(timeLeft.hours, 2));
        this.values.minutes.html(Hawk.addZeros(timeLeft.minutes, 2));
        this.values.seconds.html(Hawk.addZeros(timeLeft.seconds, 2));
        if (timeLeft.hours == 1) {
            this.captions.hours.html(this.options.unitForms.hours.single);
        } else {
            this.captions.hours.html(this.options.unitForms.hours.many);
        }
        if (timeLeft.minutes == 1) {
            this.captions.minutes.html(this.options.unitForms.minutes.single);
        } else {
            this.captions.minutes.html(this.options.unitForms.minutes.many);
        }
        if (timeLeft.seconds == 1) {
            this.captions.seconds.html(this.options.unitForms.seconds.single);
        } else {
            this.captions.seconds.html(this.options.unitForms.seconds.many);
        }
        if (this.isTargetReached(timeLeft) && !this.finished) {
            this.finished = true;
            clearInterval(this.interval);
            this.options.onTargetReached(this);
        }
    }
    run() {
        this.values = {
            hours: this.container.find('.' + this.options.valueClassNames.hours),
            minutes: this.container.find('.' + this.options.valueClassNames.minutes),
            seconds: this.container.find('.' + this.options.valueClassNames.seconds)
        };
        this.captions = {
            hours: this.container.find('.' + this.options.captionClassNames.hours),
            minutes: this.container.find('.' + this.options.captionClassNames.minutes),
            seconds: this.container.find('.' + this.options.captionClassNames.seconds)
        };
        this.update();
        this.interval = setInterval(() => {
            this.update();
        }, 1000);
    }
}
export default Hawk;
