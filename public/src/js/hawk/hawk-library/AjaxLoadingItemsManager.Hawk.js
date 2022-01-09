Hawk.AjaxLoadingItemsManager = class extends Hawk.AjaxRequestBasement {
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


		if (!this.ajaxRequestWorking) {
			this.ajaxRequestWorking = true;

			this.ajaxRequest = $.ajax({
	            type: "POST",
	            url: this.options.path,
	            dataType: "json",
	            data: { offset: offset, itemsPerLoading: this.options.itemsPerLoading },
	            success: (result) => {
	            	console.log(result);

	                this.appendContent(result.items);
	            },
	            error: function(jqXHR, textStatus, errorThrown) {
	                // here should appear error layer
	                //alert(errorThrown);

	                console.log(jqXHR.responseText);



	            },
	            complete: () => {
	                this.ajaxRequestWorking = false;
	            }
	        });
		}
	}

	appendContent(rawItems) {
		const items = Hawk.jQueryFromString(rawItems);

		items.css({ opacity: 0 });

		this.options.appendItems(this.contentContainer, items);

		items.velocity("slideDown", {
			duration: this.options.slideSpeed,
			complete: () => {
				items.velocity({ opacity: 1 }, {
					duration: this.options.fadeSpeed
				});
			}
		});
	}

	run() {
		this.buttons = this.container.find('.' + this.options.buttonClass);
		this.contentContainer = this.container.find('.' + this.options.contentContainerClass);

		this.buttons.click(() => {
			this.load(0);
		});
	}
}