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
        Hawk.scrollToElement({ anchor: anchor + this.getAnchorSuffix(), offset: this.options.offset() });
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
          
                Hawk.scrollToElement({ anchor: rawAnchor, callback: callback, delay: finalDelay, offset: this.options.offset() });
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