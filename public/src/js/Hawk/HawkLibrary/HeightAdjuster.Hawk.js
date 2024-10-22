import Hawk from './Core.Hawk';

// export default class HeightAdjuster {
//     constructor(container, options) {
//         this.container = $(container);

//         this.defaultOptions = {
//             itemContainerClass: 'adjustable-item-container',
//             itemClass: 'adjustable-item'
//         };

//         this.options = Hawk.mergeObjects(this.defaultOptions, options);

//         this.itemsCollection = this.container.find('.' + this.options.itemContainerClass);
//     }

//     adjust() {
//         const that = this;
//         let maxHeight = 0;

//         this.itemsCollection = this.container.find('.' + this.options.itemContainerClass);

//         this.itemsCollection.each(function() {
//            const itemHeight = $(this).find('.' + that.options.itemClass).outerHeight();
//         console.log(itemHeight)
//            if (itemHeight > maxHeight) {
//                maxHeight = itemHeight;
//            }
//            console.log("Item Height:", itemHeight);
//         });

//         this.itemsCollection.css({'height': maxHeight + 'px'});
        
//         console.log("Item Height:", maxHeight);
//     }

//     run() {
//         this.adjust();
//     }
// }

export default class HeightAdjuster {
    constructor(container, options) {
        this.container = $(container);

        this.defaultOptions = {
            itemContainerClass: 'adjustable-item-container',
            itemClass: 'adjustable-item'
        };

        this.options = $.extend({}, this.defaultOptions, options);

        this.itemsCollection = this.container.find('.' + this.options.itemClass);
    }

    adjust() {
        const that = this;
        let maxHeight = 0;

        this.itemsCollection.each(function() {
            const itemHeight = $(this).outerHeight();

            if (itemHeight > maxHeight) {
                maxHeight = itemHeight;
            }
        });

        this.itemsCollection.each(function() {
            $(this).css({'min-height': maxHeight + 'px'});
        });
    }

    run() {
        // console.log("Running HeightAdjuster...");
        this.adjust();
    }
}


