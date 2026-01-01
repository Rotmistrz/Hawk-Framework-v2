import Hawk from './Core.Hawk';

export default function BookmarksManager(container, options) {
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
        slideDuration: 800,
        smallDeviceSlideDuration: 800,
        fadeDuration: 200,

        defaultChangingEffect: 'slide-fade',
        changingEffects: {

        },

        rootContainer: window,

        activeBookmarkClass: "active",
        bookmarksClass: "bookmarks-manager__bookmark-container",
        contentClass: "bookmarks-manager__content",
        contentWrapperClass: "bookmarks-manager__content-wrapper",

        mobileContentContainerClass: "bookmarks-manager__mobile-content",

        bookmarkClass: "bookmarks-manager__bookmark",
        bookmarkContentClass: "bookmarks-manager__bookmark-content",

        bookmarkActiveCallback: function (bookmarkContainer) {},
        bookmarkUnactiveCallback: function (bookmarkContainer) {},
        changeContentCallback: function (content) {},
        changeBookmarkCallback: function (bookmarkContainer) {},
        changeHashCallback: function (hash) {},
        showMobileContent: function(bm, mobileContainer, systemCallback) {
            mobileContainer.velocity("slideDown", {
                durarion: bm.options.slideDuration,
                complete: function() {
                    mobileContainer.velocity({ opacity: 1 }, {
                        duration: bm.options.fadeDuration,
                        complete: function() {
                            bm.loading = false;

                            systemCallback(bm);
                        }
                    })
                }
            });
        },

        onChanging: function(bookmark, content, bm) {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.isResponsive = function () {
        return this.options.responsive;
    };

    this.isSmallDevice = function () {
        return this.isResponsive() && !this.content.is(":visible");
    };

    this.changeContent = function (content, callback, preventAutoscroll) {
        var containers = this.content;

        if (typeof preventAutoscroll == 'undefined') {
            preventAutoscroll = false;
        }

        content.each(function() {
            const thisContent = $(this);

            Hawk.writeDebugInfo(thisContent);

            const name = thisContent.attr('data-name');

            let changingEffect = that.options.defaultChangingEffect;

            if (typeof that.options.changingEffects[name] != 'undefined') {
                changingEffect = that.options.changingEffects[name];
            }

            const container = containers.filter('[data-name="' + name + '"]');

            Hawk.writeDebugInfo(container);

            if (changingEffect == 'slide') {
                var showing = function () {
                    container.html(thisContent.show());
                    container.css({ opacity: 1 });

                    container.velocity({ translateY: 0 }, {
                        duration: that.options.slideDuration,
                        complete: function () {
                            that.options.changeContentCallback(that.content);

                            if (typeof callback == "function") callback();

                            that.loading = false;

                            // var currentHeight = that.content.outerHeight();
                            //
                            // that.currentHeight = currentHeight;
                            // that.contentWrapper.css({
                            //   "min-height": that.currentHeight + "px",
                            // });
                        }
                    });
                };

                if (container.css("opacity") != 0) {
                    container.css({ opacity: 1 });

                    container.velocity(
                        { translateY: '-100%' },
                        {
                            duration: that.options.slideDuration,
                            complete: function () {
                                container.html("");
                                showing();
                            },
                        }
                    );
                } else {
                    showing();
                }
            }
            else if (changingEffect == 'fade') {
                var showing = function () {
                    container.hide();
                    container.html(thisContent.show());

                    container.velocity("slideDown", {
                        duration: that.options.slideDuration,
                        complete: function () {
                            container.velocity(
                                { opacity: 1 },
                                {
                                    duration: that.options.fadeDuration,
                                    complete: function () {
                                        that.options.changeContentCallback(that.content);

                                        if (typeof callback == "function") callback();

                                        that.loading = false;

                                        // var currentHeight = that.content.outerHeight();
                                        //
                                        // that.currentHeight = currentHeight;
                                        // that.contentWrapper.css({
                                        //   "min-height": that.currentHeight + "px",
                                        // });
                                    },
                                }
                            );
                        },
                    });
                };

                if (container.css("opacity") != 0) {
                    container.velocity(
                        { opacity: 0 },
                        {
                            duration: that.options.fadeDuration,
                            complete: function () {
                                container.html("");
                                showing();
                            },
                        }
                    );
                } else {
                    showing();
                }
            }
            else {
                var showing = function() {
                    container.hide();
                    container.html(thisContent.show());

                    container.velocity("slideDown", {
                        duration: that.options.slideDuration,
                        complete: function() {
                            container.velocity({ opacity: 1 }, {
                                duration: that.options.fadeDuration,
                                complete: function() {
                                    // var currentHeight = thisContent.outerHeight();
                                    //
                                    // that.currentHeight = currentHeight;
                                    // that.contentWrapper.css({ 'min-height': that.currentHeight + "px" });

                                    that.options.changeContentCallback(thisContent);

                                    if (typeof callback == 'function')
                                        callback();

                                    that.loading = false;
                                }
                            });
                        }
                    });
                }

                if(container.css('opacity') != 0) {
                    container.velocity({ opacity: 0 }, {
                        duration: that.options.fadeDuration,
                        complete: function() {
                            container.velocity("slideUp", {
                                duration: that.options.slideDuration,
                                complete: function() {
                                    container.html('');
                                    showing();
                                }
                            });
                        }
                    });
                } else {
                    showing();
                }
            }

            // var currentHeight = that.contentWrapper.outerHeight();
            //
            // if (that.currentHeight < currentHeight) {
            //     that.currentHeight = currentHeight;
            //
            //     that.contentWrapper.css({
            //         "min-height": that.currentHeight + "px",
            //     });
            // }

        });

        return this;
    };

    this.changeBookmark = function (bookmarkContainer, preventAutoscroll) {
        const recentBookmark = this.current;

        if (typeof recentBookmark != 'undefined' && this.isSmallDevice()) {
            const recentIndex = this.bookmarks.index(recentBookmark);
            const currentIndex = this.bookmarks.index(bookmarkContainer);

            let targetScrollPosition = 0;

            if (currentIndex > recentIndex) {
                targetScrollPosition = bookmarkContainer.offset().top - recentBookmark.outerHeight() + recentBookmark.find("." + this.options.bookmarkClass).outerHeight() - 1;
            } else {
                targetScrollPosition = bookmarkContainer.offset().top - 1;
            }

            Hawk.writeDebugInfo("currentIndex", currentIndex);
            Hawk.writeDebugInfo("recentIndex", recentIndex);
            Hawk.writeDebugInfo("targetScrollPosition", targetScrollPosition);

            $(window).scrollTo(targetScrollPosition,
                this.options.smallDeviceSlideDuration,
                { limit: false }
            );

            //Hawk.scrollToElement({ anchor: targetScrollPosition, limit: false });
        }

        this.unsetBookmarkActive();

        const that = this;

        this.current = bookmarkContainer;

        var bookmark = this.current.find("." + this.options.bookmarkClass);
        var content = this.current.find("." + this.options.bookmarkContentClass);

        this.setBookmarkActive(this.current);

        var finalContent = content;

        Hawk.writeDebugInfo("this.isSmallDevice(): " + this.isSmallDevice());

        if (this.isSmallDevice()) {
            var mobileContainer = this.container.find("." + this.options.mobileContentContainerClass);

            var mobileShowing = function() {
                content.each(function() {
                    const thisContent = $(this);
                    Hawk.writeDebugInfo(thisContent);

                    const name = thisContent.attr('data-name');

                    mobileContainer.append(thisContent.clone());
                    //
                    // const container = mainContainer.find('[data-name="' + name + '"]');
                    // container.html(thisContent.html());
                });

                //mobileContainer.html(mainContainer.children().show());

                that.options.showMobileContent(that, mobileContainer, function(bm) {

                });
            }

            if (mobileContainer.is(':visible')) {
                mobileContainer.velocity({ opacity: 0 }, {
                    duration: that.options.smallDeviceSlideDuration,
                    complete: function() {
                        mobileContainer.velocity("slideUp", {
                            duration: that.options.slideDuration,
                            complete: function() {
                                mobileContainer.html("");
                                mobileShowing();
                            }
                        });
                    }
                });
            } else {
                mobileShowing();
            }
        } else {
            finalContent = content.clone(true);

            this.changeContent(finalContent, () => {}, preventAutoscroll);
        }

        this.options.onChanging(bookmark, finalContent, this);

        return this;
    };

    this.unsetBookmarkActive = function () {
        if (this.current !== undefined) {
            var current = this.current;
            current.find("." + this.options.bookmarkClass).removeClass(this.options.activeBookmarkClass);

            this.current = undefined;

            this.options.bookmarkUnactiveCallback(current);
        }

        return this;
    };

    this.setBookmarkActive = function (bookmarkContainer) {
        var bookmark = bookmarkContainer.find("." + this.options.bookmarkClass);

        bookmark.addClass(this.options.activeBookmarkClass);

        this.options.bookmarkActiveCallback(bookmarkContainer);

        return this;
    };

    this.launchBookmark = function (n, preventAutoscroll) {
        this.changeBookmark(this.bookmarks.eq(n), preventAutoscroll);

        return this;
    };

    this.updateOptions = function (options) {
        this.options = Hawk.mergeObjects(this.options, options);

        return this;
    };

    this.clear = function (callback) {
        //this.current = undefined;
        this.unsetBookmarkActive();

        const that = this;

        this.mobileContainer.velocity({ opacity: 0 }, {
            duration: that.options.fadeDuration,
            complete: function() {
                that.mobileContainer.velocity("slideUp", {
                    duration: that.options.slideDuration
                })
            }
        });

        this.content.velocity(
            { opacity: 0 },
            {
                duration: 200,
                complete: function () {
                    if (callback !== undefined) {
                        callback();
                    }
                },
            }
        );

        return this;
    };

    this.remindOrCloseActiveBookmark = function () {
        if (this.isSmallDevice()) {
            // this.unsetBookmarkActive();
            // this.loading = false;
        }

        return this;
    };

    this.launchBookmarkByName = function (name, preventAutoscroll) {
        var finalName = name;

        this.bookmarks.each(function () {
            var current = $(this);

            if (current.attr("data-hash") == finalName) {
                that.changeBookmark(current, preventAutoscroll);

                return;
            }
        });
    };

    this.refresh = function () {
        var current = this.current;

        if (current !== undefined) {
            this.clear(function () {
                that.changeBookmark(current, true);
            });
        }

        return this;
    };

    this.run = function (defaultBookmark) {
        this.bookmarks = this.container.find("." + this.options.bookmarksClass);
        this.content = this.container.find("." + this.options.contentClass);
        this.contentWrapper = this.container.find("." + this.options.contentWrapperClass);
        this.mobileContainer = this.container.find("." + this.options.mobileContentContainerClass);

        if (typeof defaultBookmark == 'undefined') {
            defaultBookmark = 0;
        }

        var refresh;

        this.currentWidth = Hawk.w;

        $(window).resize(function () {
            if (Hawk.w != that.currentWidth) {
                clearTimeout(refresh);
                refresh = setTimeout(function () {
                    that.refresh();
                    that.currentWidth = Hawk.w;
                }, 100);
            }
        });

        var hash = window.location.hash;

        if (hash.length > 0) {
            hash = hash.substr(1);

            //console.log(hash);

            var chosenBookmark = this.bookmarks.filter('[data-hash="' + hash + '"]');

            if (chosenBookmark.length > 0) {
                this.launchBookmarkByName(hash);
                this.options.changeHashCallback(hash);
            } else {
                this.launchBookmark(defaultBookmark, true);
            }
        } else if (defaultBookmark >= 0) {
            this.launchBookmark(defaultBookmark, true);
        }

        this.bookmarks.click(function (e) {
            Hawk.writeDebugInfo("Bookmark has been clicked. Trying t load.");

            Hawk.writeDebugInfo("that.loading");
            Hawk.writeDebugInfo(that.loading);

            if (that.loading == true) {
                Hawk.writeDebugInfo("BookmarkManager is loading! Cannot load a new bookmark.");
                return;
            }

            Hawk.writeDebugInfo("Changing the bookmark...");

            if (that.current !== undefined && that.current.is($(this))) {
                Hawk.writeDebugInfo($(e.target));
                Hawk.writeDebugInfo($(e.target).parents('.' + that.options.bookmarkClass));

                if ($(e.target).hasClass(that.options.bookmarkClass) || $(e.target).parents('.' + that.options.bookmarkClass).hasClass(that.options.bookmarkClass)) {
                    that.remindOrCloseActiveBookmark();
                }
            } else {
                that.loading = true;
                that.changeBookmark($(this));
            }
        });

        return this;
    };
};