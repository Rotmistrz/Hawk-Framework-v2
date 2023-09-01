Hawk.Pager = class {
    constructor(container, options) {
        this.defaultOptions = {
            buttonClass: 'hawk-bookmarks-bar__bookmark',
            activeClass: 'active',
            valueAttrName: 'data-id',

            onSelected: (bookmarksBar, bookmark, value) => {

            }
        };

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

        this.container = $(container);
        this.bookmarks = null;
    }

    markBookmarkAsActive(bookmark) {
        bookmark.addClass(this.options.activeClass);

        return this;
    }

    clearBookmarks() {
        this.bookmarks.removeClass(this.options.activeClass);
    }

    getValue(bookmark) {
        return bookmark.attr(this.options.valueAttrName);
    }

    putValue() {

    }

    refreshDependencies() {
        this.bookmarks = this.container.find('.' + this.options.bookmarkClass);

        this.bookmarks.click((e) => {
            const bookmark = $(e.currentTarget);

            this.clearBookmarks();
            this.markBookmarkAsActive(bookmark)

            this.options.onSelected(this, bookmark, this.getValue(bookmark));
        });
    }

    run() {
        this.refreshDependencies();
    }
}