Hawk.HeightAdjuster = class {
    constructor(container, options) {
        this.container = $(container);

        this.defaultOptions = {
            itemContainerClass: 'adjustable-item-container',
            itemClass: 'adjustable-item'
        };

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

        this.itemsCollection = this.container.find('.' + this.options.itemContainerClass);
    }

    adjust() {
        const that = this;
        let maxHeight = 0;

        this.itemsCollection = this.container.find('.' + this.options.itemContainerClass);

        this.itemsCollection.each(function() {
           const itemHeight = $(this).find('.' + that.options.itemClass).outerHeight();

           if (itemHeight > maxHeight) {
               maxHeight = itemHeight;
           }
        });

        this.itemsCollection.css({'height': maxHeight + 'px'});
    }
}