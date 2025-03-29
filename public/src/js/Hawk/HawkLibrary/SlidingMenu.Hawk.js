import Hawk from './Core.Hawk';

export default function SlidingMenu(id, options) {
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
        mainClass: 'hawk-sliding-menu',
        onShowing: function(menu) {},
        onHiding: function(menu, hideCall) {
            hideCall();
        },
        onHide: function() {
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.show = function() {
        var that = this;

        var timeRemaining = this.totalDuration();

        that.options.onShowing(that.menu);
        
        // setTimeout(function() {
        //     that.options.showCallback(that.menu);
        // }, timeRemaining);

        if(this.options.mode == this.modes.fade) {
            this.menu.velocity("fadeIn", {
                duration: this.options.fadeDuration
            });
        }

        this.menu.addClass(this.openClassName);
        this.state = this.states.open;

        this.toggler.addClass('open');

        return this;
    }

    this.hide = function() {
        var that = this;

        this.options.onHiding(this.menu, function() {
            if(that.options.mode == that.modes.fade) {
                that.menu.velocity("fadeOut", {
                    duration: that.options.fadeDuration,
                    complete: function() {
                        that.options.onHide();
                    }
                });
            }

            that.menu.removeClass(that.openClassName);
        });

        this.state = this.states.closed;

        this.options.toggler.removeClass('open');

        return this;
    }

    this.totalDuration = function() {
        if(this.options.mode == this.modes.slide) {
            return this.options.slideDuration;
        } else if(this.options.mode == this.modes.slideFade) {
            return this.options.slideDuration + this.options.fadeDuration;
        } else if(this.options.mode == this.modes.fade) {
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
            if(that.state == that.states.open) {
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