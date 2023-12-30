Hawk.AjaxItemsManager = class extends Hawk.SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);
		this.contentContainer;
		this.noResultsContainer;
		this.loadingLayer;

		this.page = 1;
		this.allItemsAmount = 0;

		this.filters = {};
		this.categories = [];
		this.orderBy = "";
		this.lang = "";

		this.pagers = [];

		this.defaultOptions = {
			path: "ajax/load-page",
			itemsPerPage: 12,

			itemClass: "ajax-items-manager__item",
			contentContainerClass: "ajax-items-manager__content-container",
			loadingLayerClass: "ajax-items-manager__loading-layer",
			filterLabelClass: "ajax-items-manager__filter",
			noResultsClass: 'ajax-items-manager__no-results',

			slideSpeed: 400,
			fadeSpeed: 400,

			updateContent: function(contentContainer, items) {
				contentContainer.html(items);
			},
			createFilterLabel: (type, value, description) => {
				const label = $("<div class=\"" + this.options.filterLabelClass + "\"></div>");
				label.attr('data-type', type);
				label.attr('data-id-', value);
				label.text(description);

				return label;
			},

			onLoad: function(result, contentContainer, firstLoading) {},
			onLoading: function(contentContainer, firstLoading) {},
			onError: function(contentContainer) {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	filterExists(type, value) {
		if (typeof this.filters[type] != 'undefined') {
			console.log(this.filters[type]);

			for (const filter of this.filters[type]) {
				console.log(filter);

				if (filter == value) {
					return true;
				}
			}

			return false;
		} else {
			return false;
		}
	}

	getFilters() {
		return this.filters;
	}

	addFilter(type, value) {
		if (typeof this.filters[type] == 'undefined') {
			this.filters[type] = [];
		}

		this.filters[type].push(value);
	}

	removeAllFiltersOfType(type) {
		if (typeof this.filters[type] != 'undefined') {
			//delete this.filters[type];

			let currentFilter = this.filters[type];

			for (let i in currentFilter) {
				this.removeFilterLabel(type, currentFilter[i]);
			}

			this.filters[type] = [];
		}
	}

	removeFilter(type, value) {
		if (typeof this.filters[type] != 'undefined') {
			//delete this.filters[type];

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

	getLang() {
		return this.lang;
	}

	setLang(lang) {
		this.lang = lang;

		return this;
	}

	getOrderBy() {
		return this.orderBy;
	}

	setOrderBy(orderBy) {
		this.orderBy = orderBy;

		return this;
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

		if (typeof firstLoading == 'undefined') {
			firstLoading = false;
		}

		if (!this.isWorking()) {
			this.startWorking();

			this.loadingLayer.css({ display: 'flex' });
			//this.updateContent("");

			this.options.onLoading(this.contentContainer, firstLoading);
			
			this.setRequest($.ajax({
				type: "POST",
				url: this.options.path,
				dataType: "json",
				data: {
					'page': this.page,
					'itemsPerPage': this.options.itemsPerPage,
					'filters': this.getFilters(),
					'orderBy': this.orderBy,
					'lang': this.getLang()
				},
				success: (result) => {
					console.log(result);

					if (result.status == Hawk.RequestStatus.SUCCESS) {
						if (result.allItemsAmount > 0) {
							this.noResultsContainer.css({ display: 'none' });
						} else {
							this.noResultsContainer.css({ display: 'block' });
						}

						this.updateContent(result.html);

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
					this.loadingLayer.css({ display: 'none' });
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
		this.noResultsContainer = this.container.find('.' + this.options.noResultsClass);
		this.loadingLayer = this.container.find('.' + this.options.loadingLayerClass);

		this.load(page, true);
	}
}