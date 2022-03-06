Hawk.AjaxItemsManager = class extends Hawk.SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);
		this.contentContainer;

		this.page = 1;
		this.pagesNumber = 1;
		
		this.filters = {};
		this.categories = [];

		this.buttons;
		this.contentContainer;
		this.loadingLayer;

		this.defaultOptions = {
			itemsPerLoading: 6,
			path: "ajax/load-items",

			itemClass: "ajax-loading-items-manager__item",
			buttonClass: "ajax-loading-items-manager__button",
			contentContainerClass: "ajax-loading-items-manager__content-container",

			slideSpeed: 400,
			fadeSpeed: 400,

			appendItems: function(contentContainer, items) {
				contentContainer.append(items);
			},

			onLoad: function(buttons, contentContainer) {},
			onDone: function(buttons, contentContainer) {
				buttons.velocity({ opacity: 0 }, {
					complete: function() {
						buttons.css({ visibility: "hidden" });
					}
				});
			},

			onError: function(buttons, contentContainer) {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}
}