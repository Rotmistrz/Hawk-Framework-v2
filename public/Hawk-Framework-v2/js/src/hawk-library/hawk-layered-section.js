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

        onAboveLayerShow: function (layeredSection, aboveLayer) {
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.hideBaseLayer = function() {
        this.baseLayerInner.velocity({ opacity: 0 }, {
           complete: function() {
               that.baseLayer.css({ visibility: 'hidden' });
           }
        });
    }

    this.showBaseLayer = function() {
        this.hideLayers();

        this.baseLayer.css({ visibility: 'visible' });

        this.baseLayerInner.velocity({ opacity: 1 }, {

        });
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