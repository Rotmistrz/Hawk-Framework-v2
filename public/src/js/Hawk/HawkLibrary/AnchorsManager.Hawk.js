import Hawk from './Core.Hawk';

export default class AnchorsManager {
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