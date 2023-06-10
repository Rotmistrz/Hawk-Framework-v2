Hawk.OverlayerManager = class extends Hawk.SingleThreadClass {
    static instances = 0;

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
            fadeSpeed: 200,
            slideSpeed: 200,

            mode: Hawk.AjaxOverlayerManagerConstants.Modes.DEFAULT,
            closeOnClickOutside: false,

            popstateEventName: 'popstate.ajaxOverlayerManager',
            eventName: 'click.overlayerManager',

            wrapperClass: 'overlayer__wrapper',
            contentContainerClass: 'overlayer__content-container',
            contentClass: 'overlayer__content',

            loadingLayerClass: 'overlayer__loading-layer',

            closeButtonClass: 'overlayer-close',

            baseZIndexValue: 9000,

            changeContent: (aom, content, callback) => {
                aom.content.css({ opacity: 0 });
                aom.content.html(content);
                aom.contentContainer.velocity("slideDown", {
                    duration: aom.options.slideSpeed,
                    complete: () => {
                        aom.content.velocity({ opacity: 1 }, {
                            duration: aom.options.fadeSpeed,
                            complete: () => {
                                if (typeof callback == 'function') {
                                    callback();
                                }
                            }
                        });
                    }
                });
            },
            hide: (aom) => {
                aom.container.velocity("fadeOut", {
                    duration: aom.options.fadeSpeed,
                    complete: () => {
                        aom.body.css({ overflow: 'auto' });

                        aom.contentContainer.hide();
                        aom.content.html("");
                    }
                });
            },

            onLoading: (aom, id, result) => {},
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
        return '.' + this.options.buttonClass + '[data-overlayer-id="' + this.getOverlayerID() + '"]';
    }

    hide() {
        if (this.isWorking()) {
            this.abortRequest();
        }

        this.constructor.instances--;
        this.options.onHide(this);

        this.options.hide(this);

        this.clearHash();

        $(window).unbind(this.options.popstateEventName);
    }

    show() {
        this.constructor.instances++;

        this.options.onShow(this);

        this.container.css({ 'z-index': this.options.baseZIndexValue + this.constructor.instances });
        this.container.velocity("fadeIn", {
            duration: this.options.fadeSpeed,
            complete: () => {
                this.body.css({ overflow: 'hidden' });
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
        throw new Error("This method should be overwritten in the subclass.");
    }

    actionLoad(id, result) {
        if (result.status == Hawk.RequestStatus.SUCCESS) {
            let finalCallback = () => {};

            if (typeof this.options.onLoad == 'function') {
                finalCallback = () => {
                    this.options.onLoad(this, id, result);
                }
            }

            if (typeof this.options.onLoading == 'function') {
                this.options.onLoading(this, id, result);
            }

            this.changeContent(result.html, finalCallback);
        } else {
            this.hide();
        }

        if (typeof result.anchor != 'undefined' && result.anchor.length > 0) {
            this.setHash(this.createAnchor(result.anchor, bundle));
        }

        $(window).bind(this.options.popstateEventName, (e) => {
            this.hide();
        });
    }

    changeContent(content, callback) {
        this.options.changeContent(this, content, callback);
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

        console.log(jQueryThis);
        console.log(id);

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
        if (this.options.mode == Hawk.AjaxOverlayerManagerConstants.Modes.DELEGATE_EVENTS) {
            this.body.on('click', this.getButtonsSelector(), this.onButtonClick.bind(this));
        } else {
            if (typeof this.buttons != 'undefined') {
                this.buttons.unbind(this.options.eventName);
            }

            this.buttons = $(this.getButtonsSelector());

            this.buttons.bind(this.options.eventName, this.onButtonClick.bind(this));
        }
    }

    actionClose() {
        this.hide();
        history.pushState("", document.title, window.location.pathname + window.location.search);
    }

    initializeStructure() {
        this.body = $('body');
        this.lang = $('html').attr('lang');

        this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
        this.content = this.container.find('.' + this.options.contentClass);
        this.closeButton = this.container.find('.' + this.options.closeButtonClass);

        this.loadingLayer = this.container.find('.' + this.options.loadingLayerClass);
    }

    run() {
        this.initializeStructure();

        this.refreshDependencies();

        this.container.click((e) => {
            if (this.options.closeOnClickOutside) {
                this.actionClose();
            }
        });

        this.container.on('click', '.' + this.options.closeButtonClass, (e) => {
            this.actionClose();
        });

        this.initializeClosePreventer();

        this.options.onInitialize(this, Hawk.getHash());
    }
}