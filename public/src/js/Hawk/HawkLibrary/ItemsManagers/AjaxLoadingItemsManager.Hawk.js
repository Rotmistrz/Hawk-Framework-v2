import Hawk from "../Core.Hawk";
import SingleThreadClass from "../Basements/SingleThreadClass.Hawk";

export default class AjaxLoadingItemsManager extends SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);
		this.offset = 0;
		this.done = false;

		this.filters = {};
		this.orderBy = "";
		this.lang = "";

		this.buttons;
		this.contentContainer;
		this.loadingLayer;
		this.noItemsContainer;

		this.defaultOptions = {
			itemsPerLoading: 6,
			path: "ajax/load-items",

			itemClass: "ajax-loading-items-manager__item",
			buttonClass: "ajax-loading-items-manager__button",
			contentContainerClass: "ajax-loading-items-manager__content-container",
			loadingLayerClass: "ajax-loading-items-manager__loading-layer",
			noItemsContainerClass: "ajax-loading-items-manager__no-items",

			slideSpeed: 400,
			fadeSpeed: 400,

			appendItems: function(contentContainer, items) {
				contentContainer.append(items);
			},

			onLoad: function(buttons, contentContainer, result) {},
			onDone: function(buttons, contentContainer, result) {
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

	getOffset() {
		return this.offset;
	}

	setOffset(offset) {
		this.offset = offset;

		return this;
	}

	getFilters() {
		return this.filters;
	}

	setFilters(filters) {
		this.filters = filters;

		return this;
	}

	getOrderBy() {
		return this.orderBy;
	}

	setOrderBy(orderBy) {
		this.orderBy = orderBy;

		return this;
	}

	getLang() {
		return this.lang;
	}

	setLang(lang) {
		this.lang = lang;

		return this;
	}

	load(offset) {
		if (!this.isWorking()) {
			this.startWorking();

			this.loadingLayer.css({ display: 'flex' });

			this.setRequest($.ajax({
	            type: "POST",
	            url: this.options.path,
	            dataType: "json",
	            data: {
	            	offset: offset,
					itemsPerLoading: this.options.itemsPerLoading,
					filters: this.getFilters(),
					orderBy: this.getOrderBy(),
					lang: this.getLang()
				},
	            success: (result) => {
	            	Hawk.writeDebugInfo(result);

	                this.appendContent(result.html, result);
	                this.offset = result.offset;

	                this.done = result.isDone;

	                if (this.isDone()) {
	                	this.options.onDone(this.buttons, this.contentContainer, result);
	                }

	                if (result.offset == 0 && result.isDone) {
	                	this.showNoItemsInfo();
					} else {
	                	this.hideNoItemsInfo();
					}
	            },
	            error: function(jqXHR, textStatus, errorThrown) {
	                // here should appear error layer
	                //alert(errorThrown);

	                Hawk.writeDebugError(jqXHR.responseText);
	            },
	            complete: () => {
	                this.finishWorking();
					this.loadingLayer.css({ display: 'none' });
	            }
	        }));
		}
	}

	reload() {
		this.load(this.getOffset());
	}

	showNoItemsInfo() {
		if (!this.noItemsContainer.is(":visible")) {
			this.noItemsContainer.velocity("slideDown");
		}
	}

	hideNoItemsInfo() {
		if (this.noItemsContainer.is(":visible")) {
			this.noItemsContainer.velocity("slideUp");
		}
	}

	appendContent(rawItems, result) {
		const items = Hawk.jQueryFromString(rawItems);

		items.css({ opacity: 0 });

		this.options.appendItems(this.contentContainer, items);

		if (items.length > 0) {
			items.velocity("slideDown", {
				duration: this.options.slideSpeed,
				complete: () => {
					items.velocity({ opacity: 1 }, {
						duration: this.options.fadeSpeed
					});

					this.options.onLoad(this.buttons, this.contentContainer, result);
				}
			});
		} else {
			this.options.onLoad(this.buttons, this.contentContainer, result);
		}
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
		this.noItemsContainer = this.container.find('.' + this.options.noItemsContainerClass);

		this.buttons.click(() => {
			if (!this.isDone()) {
				this.load(this.offset);
			}
		});
	}
}