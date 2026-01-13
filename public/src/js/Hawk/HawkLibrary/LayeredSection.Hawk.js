import Hawk from './Core.Hawk';

export default function LayeredSection(container, options) {
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

        settingSameHeightThreshold: 992,
        settingSameHeight: false,

        shouldApplySameHeight: function(layeredSection) {
            return layeredSection.defaultShouldApplySameHeight();
        },

        onBaseLayerShowing: function(layeredSection, baseLayer) {

        },

        onAboveLayerShowing: function(layeredSection, aboveLayer) {

        },
        onAboveLayerShow: function(layeredSection, aboveLayer) {
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.hideBaseLayer = function() {
        this.baseLayerInner.velocity({ opacity: 0 }, {
            complete: function() {
                that.baseLayer.css({ visibility: 'hidden' });
            }
        });

        return this;
    }

    this.showBaseLayer = function(launchCallback, adjustContainerHeight) {
        this.hideLayers();

        this.baseLayer.css({ visibility: 'visible' });

        Hawk.writeDebugInfo("base Layer scrollHeight: ", this.baseLayerInner.get(0).scrollHeight);

        if (!this.shouldApplySameHeight() && (typeof adjustContainerHeight == 'undefined' || adjustContainerHeight)) {
            this.container.velocity({ height: this.baseLayerInner.get(0).scrollHeight + "px" }, {
                complete: function () {
                    that.baseLayerInner.velocity({opacity: 1}, {});
                }
            });
        } else {
            that.baseLayerInner.velocity({opacity: 1}, {});
        }

        if (typeof launchCallback == 'undefined' || launchCallback) {
            this.options.onBaseLayerShowing(this, this.baseLayer);
        }

        return this;
    }

    this.hideLayers = function(except) {
        var currentLayers = this.aboveLayers.not('[' + that.options.nameAttribute + '="' + except + '"]');

        currentLayers.velocity({ opacity: 0 }, {
            complete: function() {
                currentLayers.css({ height: 0 });
            }
        });

        return this;
    }

    this.showLayer = function(name) {
        this.hideBaseLayer();

        this.hideLayers(name);

        var currentLayer = that.aboveLayers.filter('[' + that.options.nameAttribute + '="' + name + '"]');

        Hawk.writeDebugInfo("currentLayer scrollHeight: ", currentLayer.get(0).scrollHeight);

        if (currentLayer.length > 0) {
            if (!this.shouldApplySameHeight()) {
                this.container.velocity({ height: currentLayer.find('.' + this.options.aboveLayerInnerClass).get(0).scrollHeight + "px" }, {
                    complete: () => {
                        currentLayer.css({ height: currentLayer.find('.' + this.options.aboveLayerInnerClass).get(0).scrollHeight + "px" }).velocity({ opacity: 1 }, {
                            complete: function() {
                                // currentLayer.find('.' + that.options.aboveLayerInnerClass).css({
                                //     opacity: 1
                                // });

                                that.options.onAboveLayerShow(that, currentLayer);
                            }
                        });
                    }
                });
            } else {
                currentLayer.css({ height: '100%' }).velocity({ opacity: 1 }, {
                    complete: function() {
                        // currentLayer.find('.' + that.options.aboveLayerInnerClass).css({
                        //     opacity: 1
                        // });

                        that.options.onAboveLayerShow(that, currentLayer);
                    }
                });
            }

            that.options.onAboveLayerShowing(that, currentLayer);

            return true;
        } else {
            return false;
        }
    }

    this.applySameHeightForAll = function() {
        var maxHeight = 0;

        this.baseLayer.add(this.aboveLayers).each(function() {
            Hawk.writeDebugInfo("scrollHeight: " + $(this).get(0).scrollHeight);

            if (maxHeight < $(this).get(0).scrollHeight) {
                maxHeight = $(this).get(0).scrollHeight;
            }
        });

        Hawk.writeDebugInfo("height to apply: " + maxHeight);

        this.container.css({ 'min-height': maxHeight + "px" });
    }

    this.shouldApplySameHeight = function() {
        return this.options.shouldApplySameHeight(this);
    }

    this.defaultShouldApplySameHeight = function() {
        return this.options.settingSameHeight && this.options.settingSameHeightThreshold <= Hawk.w;
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

        if (this.shouldApplySameHeight()) {
            this.applySameHeightForAll();
        }

        return this;
    }
}