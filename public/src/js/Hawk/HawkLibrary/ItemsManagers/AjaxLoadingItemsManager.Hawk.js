Hawk.AjaxLoadingItemsManager = class extends Hawk.SingleThreadClass {
	constructor(container, options) {
		super();

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

			itemsDisplayingType: 'block',

			bundle: {},

			itemClass: "hawk-ajax-loading-items-manager__item",
			buttonClass: "hawk-ajax-loading-items-manager__button",
			contentContainerClass: "hawk-ajax-loading-items-manager__content-container",
			loadingLayerClass: "hawk-ajax-loading-items-manager__loading-layer",

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

	isDone() {
		return this.done;
	}

	getBundle() {
		return this.options.bundle;
	}

	setFilter(name, value) {
		this.filters[name] = value;

		return this;
	}

	load(offset) {
		if (!this.isWorking()) {
			this.startWorking();

			if (typeof offset == 'undefined') {
				offset = 0;
			}

			this.loadingLayer.velocity({ opacity: 1 }, {
				duration: 100
			});

			this.setRequest($.ajax({
				type: "POST",
				url: this.options.path,
				dataType: "json",
				data: { offset: offset, itemsPerLoading: this.options.itemsPerLoading, filters: this.filters, bundle: this.getBundle() },
				success: (result) => {
					console.log(result);

					this.appendContent(result.items);
					this.offset = result.offset;

					this.done = result.isDone;

					if (this.isDone()) {
						this.options.onDone(this.buttons, this.contentContainer);
					}
				},
				error: function(jqXHR, textStatus, errorThrown) {
					// here should appear error layer
					//alert(errorThrown);

					console.log(jqXHR.responseText);
				},
				complete: () => {
					this.finishWorking();

					this.loadingLayer.velocity({ opacity: 0 }, {
						duration: 100
					});
				}
			}));
		}
	}

	appendContent(rawItems) {
		const items = Hawk.jQueryFromString(rawItems);

		items.css({ opacity: 0 });

		this.options.appendItems(this.contentContainer, items);

		items.velocity("slideDown", {
			display: this.options.itemsDisplayingType,
			duration: this.options.slideSpeed,
			complete: () => {
				items.velocity({ opacity: 1 }, {
					duration: this.options.fadeSpeed
				});
			}
		});
	}

	clear() {
		this.contentContainer.children().velocity("slideUp", {
			complete: function(elements) {
				$(elements).remove();
			}
		});

		this.buttons.css({ visibility: 'visible' }).velocity({ opacity: 1 });

		this.offset = 0;
		this.done = false;
	}

	run() {
		this.buttons = this.container.find('.' + this.options.buttonClass);
		this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
		this.loadingLayer = this.container.find('.' + this.options.loadingLayerClass);

		this.buttons.click(() => {
			if (!this.isDone()) {
				this.load(this.offset);
			}
		});
	}
}