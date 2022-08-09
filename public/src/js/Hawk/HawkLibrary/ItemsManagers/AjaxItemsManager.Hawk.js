Hawk.AjaxItemsManager = class extends Hawk.SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);
		this.contentContainer;
		this.loadingLayer;

		this.page = 1;
		this.allItemsAmount = 0;
		
		this.filters = {};
		this.categories = [];

		this.pagers = [];

		this.defaultOptions = {
			path: "ajax/load-page",
			itemsPerPage: 12,

			itemClass: "ajax-items-manager__item",
			contentContainerClass: "ajax-items-manager__content-container",
			filterLabelClass: "ajax-items-manager__filter",

			slideSpeed: 400,
			fadeSpeed: 400,

			updateContent: function(contentContainer, items) {
				contentContainer.html(items);
			},
			createFilterLabel: (type, value, description) => {
				return "<div class=\"" + this.options.filterLabelClass + "\">" + description + "</div>"
			},

			onLoad: function(result, contentContainer, firstLoading) {},
			onError: function(contentContainer) {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	addFilter(type, value) {
		if (typeof this.filters[type] == 'undefined') {
			this.filters[type] = [];
		}

		this.filters[type].push(value);
	}

	removeFilter(type, value) {
		if (typeof this.filters[type] != 'undefined') {
			let currentFilter = this.filters[type];

			for (let i in currentFilter) {
				if (currentFilter[i] == value) {
					currentFilter.splice(i, 1);

					this.removeFilterLabel(type, value);

					return;
				}
			}
		}
	}

	createFilterLabel(type, value, description) {
		return this.options.createFilterLabel(type, value, description);
	}

	removeFilterLabel(type, value) {
		this.container.find('.' + this.options.filterLabelClass).filter(function() {
			return $(this).attr('data-type') == type;
		}).filter(function() {
			return 	$(this).attr('data-id') == value;
		}).remove();
	}

	setPage(page) {
		this.page = page;

		return this;
	}

	getPage() {
		return this.page;
	}

	setAllItemsAmount(allItemsAmount) {
		this.allItemsAmount = allItemsAmount;

		return this;
	}

	getAllItemsAmount() {
		return this.allItemsAmount;
	}

	getPagesNumber() {
		return Math.ceil(this.allItemsAmount / this.options.itemsPerPage);
	}

	addPager(pager) {
		this.pagers.push(pager);

		return this;
	}

	doPagersAction(action) {
		for (const pager of this.pagers) {
			action(pager);
		}
	}

	refreshPagers() {
		this.doPagersAction((pager) => {
			pager.setPagesNumber(this.getPagesNumber());
			pager.updatePage(this.getPage());
		});
	}

	updateContent(content) {
		this.options.updateContent(this.contentContainer, content);
	}

	load(page, firstLoading) {
		this.setPage(page);

		console.log("AjaxItemsManager::load()");
		console.log(firstLoading);

		if (typeof firstLoading == 'undefined') {
			firstLoading = false;
		}

		if (!this.isWorking()) {
			this.startWorking();

			this.setRequest($.ajax({
	            type: "POST",
	            url: this.options.path,
	            dataType: "json",
	            data: {
	                'page': this.page,
	                'itemsPerPage': this.options.itemsPerPage,
	                'filters': this.filters
	            },
	            success: (result) => {
	            	console.log(result);

	                if (result.status == Hawk.RequestStatus.SUCCESS) {
	                    this.setAllItemsAmount(result.allItemsAmount);
	                    this.setPage(result.page);

		                this.refreshPagers();

		                //this.makePageActive(this.getPage());

		                this.updateContent(result.html);
	                }

	                this.options.onLoad(result, this.contentContainer, firstLoading);
	            },
	            error: (jqXHR, textStatus, errorThrown) => {
	                console.warn(jqXHR.responseText);
	            },
	            complete: () => {
	                this.finishWorking();
	            }
	        }));
		}
	}

	reload() {
		this.load(this.getPage());
	}

	run(page) {
		if (typeof page == 'undefined') {
			page = 1;
		}

		this.contentContainer = this.container.find('.' + this.options.contentContainerClass);

		this.load(page, true);
	}
}