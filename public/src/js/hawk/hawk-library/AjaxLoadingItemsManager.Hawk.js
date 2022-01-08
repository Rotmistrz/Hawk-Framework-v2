Hawk.AjaxLoadingItemsManager = class {
	constructor(container, options) {
		this.container = $(container);
		this.offset = 0;
		this.done = false;
		this.filters = {};

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
				contentContainer.html(items);
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

	isDone() {
		return this.done;
	}

	setFilter(name, value) {
		this.filters[name] = value;

		return this;
	}

	load(offset) {
		console.log("lalalaa i co cyk");
	}

	appendContent(items) {
		const that = this;

		items.css({ opacity: 0 });

		this.options.appendItems(this.contentContainer, items);

		items.velocity("slideDown", {
			duration: that.options.slideSpeed,
			complete: function() {
				items.velocity({ opacity: 1 }, {
					duration: that.options.fadeSpeed
				});
			}
		});
	}

	run() {
		this.buttons = this.container.find('.' + this.options.buttonClass);
		this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
	}
}