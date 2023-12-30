Hawk.ItemsManager = class extends Hawk.SingleThreadClass {
    constructor(container, options) {
        super();

        this.container = container;

        this.defaultOptions = {
            itemClass: 'hawk-items-manager__item',
            bookmarkClass: 'hawk-items-manager__bookmark',

            groupIdAttribute: 'data-id',
            managerIdAttribute: 'data-manager-id',

            mode: Hawk.ItemsManagerConstants.CLICK,

            getGroupClassname: (id) => {
                return "hawk-items-manager-group-" + id;
            },
            actionShow: (items, imCallback) => {
                $(items).removeClass('hawk-hidden');
                $(items).addClass('hawk-shown');

                imCallback();
            },
            actionHide: (itemsToHide) => {
                itemsToHide.removeClass('hawk-shown');
                itemsToHide.addClass('hawk-hidden');
            },

            onGroupSelected: (groupID) => {}
        }

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

        this.managerID = this.container.attr(this.options.managerIdAttribute);
    }

    selectItems(items) {
        if (!this.isWorking()) {
            this.startWorking();

            this.hideItemsExcept(items);

            this.options.actionShow(items, () => {
                this.finishWorking();
            });
        }
    }

    hideItemsExcept(items) {
        const itemsToHide = this.getItems().not(items);

        this.options.actionHide(itemsToHide);
    }

    selectItemsByGroup(groupID) {
        let cssSelector = '.' + this.options.getGroupClassname(groupID);

        if (this.hasManagerID()) {
            cssSelector += '[' + this.options.managerIdAttribute + '="' + this.getManagerID() + '"]';
        }

        const selectedItems = this.getItems().filter(cssSelector);

        this.selectItems(selectedItems);

        this.options.onGroupSelected(groupID);
    }

    changeBookmark(groupID) {
        const field = this.bookmarks.find('input[value="' + groupID + '"]');

        console.log("Changing bookmark.......");
        console.log(field);

        field.prop('checked', true);
        field.trigger('change');
    }

    onButtonClick(button) {
        this.selectItemsByGroup($(button).attr(this.options.groupIdAttribute));
    }

    onFieldSelected(field) {
        this.selectItemsByGroup(field.val());
    }

    getManagerID() {
        const managerID = this.container.attr(this.options.managerIdAttribute);

        if (typeof managerID != 'undefined') {
            return managerID;
        } else {
            return "";
        }
    }

    hasManagerID() {
        return this.getManagerID().length > 0;
    }

    getItems() {
        let cssSelector = '.' + this.options.itemClass;

        if (this.hasManagerID()) {
            cssSelector += '[' + this.options.managerIdAttribute + '="' + this.getManagerID() + '"]';
        }

        console.log(cssSelector);

        console.log(this.container.find(cssSelector));

        return this.container.find(cssSelector);
    }

    getBookmarks() {
        let cssSelector = '.' + this.options.bookmarkClass;

        if (this.hasManagerID()) {
            cssSelector += '[' + this.options.managerIdAttribute + '="' + this.getManagerID() + '"]';
        }

        return this.container.find(cssSelector);
    }

    run() {
        this.items = this.getItems();
        this.bookmarks = this.getBookmarks();

        if (this.options.mode == Hawk.ItemsManagerConstants.Modes.CHOICE) {
            this.bookmarks.find('input').change((e) => {
                this.onFieldSelected($(e.currentTarget));
            });
        } else {
            this.bookmarks.click((e) => {
                e.stopPropagation();

                this.onButtonClick($(e.currentTarget));
            });
        }
    }
}