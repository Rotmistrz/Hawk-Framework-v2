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
    slideDuration: 200,
    fadeDuration: 200,

    rootContainer: window,

    activeBookmarkClass: "active",
    bookmarksClass: "bookmarks-manager__bookmark-container",
    contentClass: "bookmarks-manager__content",
    contentWrapperClass: "bookmarks-manager__content-wrapper",

    bookmarkClass: "bookmarks-manager__bookmark",
    bookmarkContentClass: "bookmarks-manager__bookmark-content",

    bookmarkActiveCallback: function (bookmarkContainer) {},
    bookmarkUnactiveCallback: function (bookmarkContainer) {},
    changeContentCallback: function (content) {},
    changeBookmarkCallback: function (bookmarkContainer) {},
    changeHashCallback: function (hash) {},
  };

  this.options = Hawk.mergeObjects(this.defaultOptions, options);

  this.isResponsive = function () {
    return this.options.responsive;
  };

  this.isSmallDevice = function () {
    return this.isResponsive() && !this.content.is(":visible");
  };

  this.changeContent = function (content, callback, preventAutoscroll) {
    var container = this.content;

    // if (outerContainer === undefined) {
    //   container = this.content;
    // } else container = outerContainer;

    if (typeof preventAutoscroll == 'undefined') {
      preventAutoscroll = false;
    }

    var showing = function () {
      container.hide();
      container.html(content.show());

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

                  var currentHeight = that.content.outerHeight();

                  that.currentHeight = currentHeight;
                  that.contentWrapper.css({
                    "min-height": that.currentHeight + "px",
                  });
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

    if (this.options.activeScroll && Hawk.w < this.options.activeScrollWidth && !preventAutoscroll) {
      var id = this.content.attr("id");

      if (typeof id != 'undefined') {
        Hawk.scrollToElement({ anchor: "#" + id, container: this.options.rootContainer });
      }
    }

    return this;
  };

  this.changeBookmark = function (bookmarkContainer, preventAutoscroll) {
    this.unsetBookmarkActive();

    this.current = bookmarkContainer;

    var bookmark = this.current.find("." + this.options.bookmarkClass);
    var content = this.current.find("." + this.options.bookmarkContentClass);

    this.setBookmarkActive(this.current);

    if (this.isSmallDevice()) {
      content.velocity("slideDown", {
        duration: that.options.slideDuration,
        complete: function () {
          that.options.changeContentCallback(content);

          that.loading = false;
        },
      });
    } else {
      this.changeContent(content.clone(true), () => {}, preventAutoscroll);
    }

    return this;
  };

  this.unsetBookmarkActive = function () {
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

  this.remindActiveBookmark = function () {
    if (this.isSmallDevice()) {
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
    } else {
      this.launchBookmark(defaultBookmark, true);
    }

    this.bookmarks.click(function () {
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