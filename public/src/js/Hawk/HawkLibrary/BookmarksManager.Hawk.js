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

    defaultChangingEffect: 'fade',
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
      mobileContainer.show();

      bm.loading = false;

      systemCallback(bm);
    },
      unsetBookmarkActive: function(element) {
          // to domyslnie w opcjach np
          $(element).velocity("slideUp", {
              duration: that.options.smallDeviceSlideDuration
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

    // if (outerContainer === undefined) {
    //   container = this.content;
    // } else container = outerContainer;

    if (typeof preventAutoscroll == 'undefined') {
      preventAutoscroll = false;
    }

    // if (this.options.activeScroll && Hawk.w < this.options.activeScrollWidth && !preventAutoscroll) {
    //   var id = this.content.attr("id");
    //
    //   if (typeof id != 'undefined') {
    //     Hawk.writeDebugInfo('BookmarksManager::scrollingToContent');
    //
    //     $(window).scrollTo("#" + id,
    //         this.options.smallDeviceSlideDuration,
    //         { limit: false }
    //     );
    //
    //     //Hawk.scrollToElement({ anchor: "#" + id, container: this.options.rootContainer, duration: this.options.smallDeviceSlideDuration });
    //   }
    // }

    content.each(function() {
      const thisContent = $(this);

      const name = thisContent.attr('data-name');

      let changingEffect = that.options.defaultChangingEffect;

      if (typeof that.options.changingEffects[name] != 'undefined') {
        changingEffect = that.options.changingEffects[name];
      }

      const container = containers.filter('[data-name="' + name + '"]');

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
      } else if (changingEffect == 'fade') {
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
      } else {
        container.html(thisContent.show());

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

      var currentHeight = that.contentWrapper.outerHeight();

      if (that.currentHeight < currentHeight) {
        that.currentHeight = currentHeight;

        that.contentWrapper.css({
          "min-height": that.currentHeight + "px",
        });
      }

    });

    // var showing = function () {
    //   container.hide();
    //   container.html(content.show());
    //
    //   container.velocity("slideDown", {
    //     duration: that.options.slideDuration,
    //     complete: function () {
    //       container.velocity(
    //           { opacity: 1 },
    //           {
    //             duration: that.options.fadeDuration,
    //             complete: function () {
    //               that.options.changeContentCallback(that.content);
    //
    //               if (typeof callback == "function") callback();
    //
    //               that.loading = false;
    //
    //               var currentHeight = that.content.outerHeight();
    //
    //               that.currentHeight = currentHeight;
    //               that.contentWrapper.css({
    //                 "min-height": that.currentHeight + "px",
    //               });
    //             },
    //           }
    //       );
    //     },
    //   });
    // };
    //
    // if (container.css("opacity") != 0) {
    //   container.velocity(
    //       { opacity: 0 },
    //       {
    //         duration: that.options.fadeDuration,
    //         complete: function () {
    //           container.html("");
    //           showing();
    //         },
    //       }
    //   );
    // } else {
    //   showing();
    // }



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

    this.current = bookmarkContainer;

    var bookmark = this.current.find("." + this.options.bookmarkClass);
    var content = this.current.find("." + this.options.bookmarkContentClass);


    this.setBookmarkActive(this.current);

    var finalContent = content;

    if (this.isSmallDevice()) {
      // content.velocity("slideDown", {
      //   duration: that.options.smallDeviceSlideDuration,
      //   complete: function () {
      //     that.options.changeContentCallback(content);
      //
      //     that.loading = false;
      //   },
      // });
      var mobileContainer = this.current.find("." + this.options.mobileContentContainerClass);
      mobileContainer.hide();

      var mainContainer = this.contentWrapper.clone();

      content.each(function() {
        const thisContent = $(this);
        Hawk.writeDebugInfo(thisContent);

        const name = thisContent.attr('data-name');

        const container = mainContainer.find('[data-name="' + name + '"]');
        container.html(thisContent.html());
      });

      mobileContainer.html(mainContainer.children().show());

      this.options.showMobileContent(that, mobileContainer, function(bm) {

      });
      //mobileContainer.show();

      // mobileContainer.velocity("slideDown", {
      //   duration: that.options.smallDeviceSlideDuration,
      //   complete: function () {
      //     that.options.changeContentCallback(content);
      //     that.loading = false;
      //   },
      // });
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

      this.options.unsetBookmarkActive(current.find("." + this.options.mobileContentContainerClass));

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

  this.remindOrCloseActiveBookmark = function () {
    if (this.isSmallDevice()) {
      this.unsetBookmarkActive();
      this.loading = false;
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

// import Hawk from './Core.Hawk';
//
// export default function BookmarksManager(container, options) {
//   this.container = $(container);
//   this.content;
//   this.contentWrapper;
//   this.bookmarks;
//
//   this.current; // current bookmark container
//   this.currentHeight = 0;
//
//   this.currentWidth;
//
//   this.loading = false;
//
//   var that = this;
//
//   this.defaultOptions = {
//     responsive: true,
//     activeScroll: false,
//
//     activeScrollWidth: 480,
//     slideDuration: 200,
//     fadeDuration: 200,
//
//     rootContainer: window,
//
//     activeBookmarkClass: "active",
//     bookmarksClass: "bookmarks-manager__bookmark-container",
//     contentClass: "bookmarks-manager__content",
//     contentWrapperClass: "bookmarks-manager__content-wrapper",
//
//     bookmarkClass: "bookmarks-manager__bookmark",
//     bookmarkContentClass: "bookmarks-manager__bookmark-content",
//
//     bookmarkActiveCallback: function (bookmarkContainer) {},
//     bookmarkUnactiveCallback: function (bookmarkContainer) {},
//     changeContentCallback: function (content) {},
//     changeBookmarkCallback: function (bookmarkContainer) {},
//     changeHashCallback: function (hash) {},
//   };
//
//   this.options = Hawk.mergeObjects(this.defaultOptions, options);
//
//   this.isResponsive = function () {
//     return this.options.responsive;
//   };
//
//   this.isSmallDevice = function () {
//     return this.isResponsive() && !this.content.is(":visible");
//   };
//
//   this.changeContent = function (content, callback, preventAutoscroll) {
//     var container = this.content;
//
//     // if (outerContainer === undefined) {
//     //   container = this.content;
//     // } else container = outerContainer;
//
//     if (typeof preventAutoscroll == 'undefined') {
//       preventAutoscroll = false;
//     }
//
//     var showing = function () {
//       container.hide();
//       container.html(content.show());
//
//       container.velocity("slideDown", {
//         duration: that.options.slideDuration,
//         complete: function () {
//           container.velocity(
//               { opacity: 1 },
//               {
//                 duration: that.options.fadeDuration,
//                 complete: function () {
//                   that.options.changeContentCallback(that.content);
//
//                   if (typeof callback == "function") callback();
//
//                   that.loading = false;
//
//                   var currentHeight = that.content.outerHeight();
//
//                   that.currentHeight = currentHeight;
//                   that.contentWrapper.css({
//                     "min-height": that.currentHeight + "px",
//                   });
//                 },
//               }
//           );
//         },
//       });
//     };
//
//     if (container.css("opacity") != 0) {
//       container.velocity(
//           { opacity: 0 },
//           {
//             duration: that.options.fadeDuration,
//             complete: function () {
//               container.html("");
//               showing();
//             },
//           }
//       );
//     } else {
//       showing();
//     }
//
//     if (this.options.activeScroll && Hawk.w < this.options.activeScrollWidth && !preventAutoscroll) {
//       var id = this.content.attr("id");
//
//       if (typeof id != 'undefined') {
//         Hawk.scrollToElement({ anchor: "#" + id, container: this.options.rootContainer });
//       }
//     }
//
//     return this;
//   };
//
//   this.changeBookmark = function (bookmarkContainer, preventAutoscroll) {
//     this.unsetBookmarkActive();
//
//     this.current = bookmarkContainer;
//
//     var bookmark = this.current.find("." + this.options.bookmarkClass);
//     var content = this.current.find("." + this.options.bookmarkContentClass);
//
//     this.setBookmarkActive(this.current);
//
//     if (this.isSmallDevice()) {
//       content.velocity("slideDown", {
//         duration: that.options.slideDuration,
//         complete: function () {
//           that.options.changeContentCallback(content);
//
//           that.loading = false;
//         },
//       });
//     } else {
//       this.changeContent(content.clone(true), () => {}, preventAutoscroll);
//     }
//
//     return this;
//   };
//
//   this.unsetBookmarkActive = function () {
//     if (this.current !== undefined) {
//       var current = this.current;
//       current.find("." + this.options.bookmarkClass).removeClass(this.options.activeBookmarkClass);
//
//       current.find("." + this.options.bookmarkContentClass).velocity("slideUp", {
//         duration: that.options.slideDuration,
//       });
//
//       this.current = undefined;
//
//       this.options.bookmarkUnactiveCallback(current);
//     }
//
//     return this;
//   };
//
//   this.setBookmarkActive = function (bookmarkContainer) {
//     var bookmark = bookmarkContainer.find("." + this.options.bookmarkClass);
//
//     bookmark.addClass(this.options.activeBookmarkClass);
//
//     this.options.bookmarkActiveCallback(bookmarkContainer);
//
//     return this;
//   };
//
//   this.launchBookmark = function (n, preventAutoscroll) {
//     this.changeBookmark(this.bookmarks.eq(n), preventAutoscroll);
//
//     return this;
//   };
//
//   this.updateOptions = function (options) {
//     this.options = Hawk.mergeObjects(this.options, options);
//
//     return this;
//   };
//
//   this.clear = function (callback) {
//     //this.current = undefined;
//
//     this.unsetBookmarkActive();
//     this.content.velocity(
//         { opacity: 0 },
//         {
//           duration: 200,
//           complete: function () {
//             if (callback !== undefined) {
//               callback();
//             }
//           },
//         }
//     );
//
//     return this;
//   };
//
//   this.remindActiveBookmark = function () {
//     if (this.isSmallDevice()) {
//     }
//
//     return this;
//   };
//
//   this.launchBookmarkByName = function (name, preventAutoscroll) {
//     var finalName = name;
//
//     this.bookmarks.each(function () {
//       var current = $(this);
//
//       if (current.attr("data-hash") == finalName) {
//         that.changeBookmark(current, preventAutoscroll);
//
//         return;
//       }
//     });
//   };
//
//   this.refresh = function () {
//     var current = this.current;
//
//     if (current !== undefined) {
//       this.clear(function () {
//         that.changeBookmark(current, true);
//       });
//     }
//
//     return this;
//   };
//
//   this.run = function (defaultBookmark) {
//     this.bookmarks = this.container.find("." + this.options.bookmarksClass);
//     this.content = this.container.find("." + this.options.contentClass);
//     this.contentWrapper = this.container.find("." + this.options.contentWrapperClass);
//
//     if (typeof defaultBookmark == 'undefined') {
//       defaultBookmark = 0;
//     }
//
//     var refresh;
//
//     this.currentWidth = Hawk.w;
//
//     $(window).resize(function () {
//       if (Hawk.w != that.currentWidth) {
//         clearTimeout(refresh);
//         refresh = setTimeout(function () {
//           that.refresh();
//           that.currentWidth = Hawk.w;
//         }, 100);
//       }
//     });
//
//     var hash = window.location.hash;
//
//     if (hash.length > 0) {
//       hash = hash.substr(1);
//
//       //console.log(hash);
//
//       var chosenBookmark = this.bookmarks.filter('[data-hash="' + hash + '"]');
//
//       if (chosenBookmark.length > 0) {
//         this.launchBookmarkByName(hash);
//         this.options.changeHashCallback(hash);
//       } else {
//         this.launchBookmark(defaultBookmark, true);
//       }
//     } else {
//       this.launchBookmark(defaultBookmark, true);
//     }
//
//     this.bookmarks.click(function () {
//       if (that.loading == true) {
//         return;
//       }
//
//       if (that.current !== undefined && that.current.is($(this))) {
//         that.remindActiveBookmark();
//       } else {
//         that.changeBookmark($(this));
//         that.loading = true;
//       }
//     });
//
//     return this;
//   };
// };
