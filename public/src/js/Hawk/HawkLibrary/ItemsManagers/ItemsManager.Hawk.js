import Hawk from "../Core.Hawk";
import SingleThreadClass from '../Basements/SingleThreadClass.Hawk';
import ItemsManagerMode from "./Enums/ItemsManagerMode.Hawk";

export default class ItemsManager extends SingleThreadClass {
    constructor(container, options) {
        super();

        this.container = container;

        this.defaultOptions = {
            itemClass: 'hawk-items-manager__item',
            bookmarkClass: 'hawk-items-manager__bookmark',

            groupIdAttribute: 'data-id',
            managerIdAttribute: 'data-manager-id',

            allValue: -1,

            mode: ItemsManagerMode.CLICK,

            getGroupClassname: (id) => {
                return "hawk-items-manager-group-" + id;
            },
            actionShow: (items, imCallback) => {
                $(items).show();

                imCallback();
            },
            actionHide: (itemsToHide) => {
                itemsToHide.hide();
            },

            onGroupSelected: (groupID) => {}
        }

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

        this.managerID = this.container.attr(this.options.managerIdAttribute);
    }

    disableFields() {
        const bookmarks = this.getBookmarks();
        bookmarks.find('input').prop('disabled', true);
    }

    enableFields() {
        const bookmarks = this.getBookmarks();
        bookmarks.find('input').prop('disabled', false);
    }

    selectItems(items) {
        if (!this.isWorking()) {
            this.startWorking();

            this.hideItemsExcept(items);

            this.options.actionShow(items, () => {
                this.finishWorking();
                this.enableFields();
            });
        }
    }

    hideItemsExcept(items) {
        const itemsToHide = this.getItems().not(items);

        this.options.actionHide(itemsToHide);
    }

    selectItemsByGroup(groupID) {
        if (groupID != this.options.allValue) {
            let cssSelector = '.' + this.options.getGroupClassname(groupID);

            if (this.hasManagerID()) {
                cssSelector += '[' + this.options.managerIdAttribute + '="' + this.getManagerID() + '"]';
            }

            var selectedItems = this.getItems().filter(cssSelector);
        } else {
            var selectedItems = this.getItems();
        }

        this.selectItems(selectedItems);

        this.options.onGroupSelected(groupID);
    }

    changeBookmark(groupID) {
        const field = this.bookmarks.find('input[value="' + groupID + '"]');

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

        if (this.options.mode == ItemsManagerMode.CHOICE) {
            this.bookmarks.find('input').change((e) => {
                this.disableFields();
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