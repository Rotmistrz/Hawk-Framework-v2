import Hawk from "../Core.Hawk";
import SingleThreadClass from "../Basements/SingleThreadClass.Hawk"

export default class AjaxItemsManager extends SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);
		this.contentContainer;
		this.noResultsContainer;
        this.allItemsAmountContainer;
		this.loadingLayer;

		this.page = 1;
		this.allItemsAmount = 0;

		this.filters = {};
        this.extraData = {};
		this.orderBy = "";
        this.sortingType = "ASC";
		this.lang = "";

		this.pagers = [];

		this.defaultOptions = {
			path: "ajax/load-page",
			itemsPerPage: 12,

            extraData: {

            },

			itemClass: "ajax-items-manager__item",
			contentContainerClass: "ajax-items-manager__content-container",
			loadingLayerClass: "ajax-items-manager__loading-layer",
			filterLabelClass: "ajax-items-manager__filter",
            filterCloseButtonClass: "chosen-item__close",
            filtersListClass: "ajax-items-manager__filters-list",
			noResultsClass: 'ajax-items-manager__no-results',
            allItemsAmountValueClass: 'ajax-items-manager__all-items-amount-value',

			slideSpeed: 400,
			fadeSpeed: 400,

			updateContent: function(contentContainer, items) {
				contentContainer.html(items);
			},
			createFilterLabel: (type, value, description, label) => {
				const filterLabel = $("<div class=\"" + this.options.filterLabelClass + "\"></div>");
                filterLabel.attr('data-type', type);
                filterLabel.attr('data-id-', value);
                filterLabel.text(description);

				return filterLabel;
			},
            onCloseFilterLabel: function(type, value) {},

			onLoad: function(result, contentContainer, firstLoading) {},
			onLoading: function(contentContainer, firstLoading) {},
			onException: function(contentContainer) {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);

        this.setItemsPerPage(this.options.itemsPerPage);
        this.setExtraData(this.options.extraData);
	}

	filterExists(type, value) {
		if (typeof this.filters[type] != 'undefined') {
			for (const filter of this.filters[type]) {
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

	getFilter(type) {
		if (typeof this.filters[type] == 'undefined') {
			return [];
		} else {
			return this.filters[type];
		}
	}

	addFilter(type, value, description, label) {
		if (typeof this.filters[type] == 'undefined') {
			this.filters[type] = [];
		}

		this.filters[type].push(value);

        if (this.filtersList.length > 0) {
            this.addFilterLabel(type, value, description, label);
        }
	}

	setFilters(type, values) {
		this.filters[type] = values;
	}

    removeAllFilters() {
        for (var type in this.filters) {
            this.removeAllFiltersOfType(type);
        }
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

    addFilterLabel(type, value, description, label) {
        const filterLabel = this.createFilterLabel(type, value, description, label);

        this.filtersList.append(filterLabel);

        filterLabel.find('.' + this.options.filterCloseButtonClass).click(() => {
            if (!this.isWorking() && this.options.onCloseFilterLabel(type, value)) {
                this.removeFilter(type, value);
                this.setPage(1);
                this.reload();
            }
        });
    }

	createFilterLabel(type, value, description, label) {
		return this.options.createFilterLabel(type, value, description, label);
	}

	removeFilterLabel(type, value) {
		this.container.find('.' + this.options.filterLabelClass).filter(function() {
			return $(this).attr('data-type') == type;
		}).filter(function() {
			return 	$(this).attr('data-id') == value;
		}).remove();
	}

    getExtraData() {
        return this.extraData;
    }

    setExtraDatum(key, value) {
        this.extraData[key] = value;
    }

    setExtraData(extraData) {
        this.extraData = extraData;
    }

	getLang() {
		return this.lang;
	}

	setLang(lang) {
		this.lang = lang;

		return this;
	}

    getItemsPerPage() {
        return this.itemsPerPage;
    }

    setItemsPerPage(itemsPerPage) {
        this.itemsPerPage = itemsPerPage;

        return this;
    }

	getOrderBy() {
		return this.orderBy;
	}

	setOrderBy(orderBy) {
		this.orderBy = orderBy;

		return this;
	}

    getSortingType() {
        return this.sortingType;
    }

    setSortingType(sortingType) {
        this.sortingType = sortingType;

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
		return Math.ceil(this.allItemsAmount / this.getItemsPerPage());
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

    updateAllItemsAmountValue(allItemsAmount) {
        this.allItemsAmountContainer.text(allItemsAmount);
    }

	load(page, firstLoading) {
		this.setPage(page);

		if (typeof firstLoading == 'undefined') {
			firstLoading = false;
		}

		Hawk.writeDebugInfo("Trying to load path: " + this.options.path);

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
					'itemsPerPage': this.getItemsPerPage(),
					'filters': this.getFilters(),
					'orderBy': this.orderBy,
                    'sortingType': this.getSortingType(),
					'lang': this.getLang(),
                    'extraData': this.getExtraData()
				},
				success: (result) => {
					Hawk.writeDebugInfo(result);

					if (result.status == Hawk.RequestStatus.SUCCESS) {
						if (result.allItemsAmount > 0) {
							this.noResultsContainer.css({ display: 'none' });
						} else {
							this.noResultsContainer.css({ display: 'block' });
						}

						this.updateContent(result.html);

						this.setAllItemsAmount(result.allItemsAmount);
                        this.updateAllItemsAmountValue(this.getAllItemsAmount());

						this.setPage(result.page);

						this.refreshPagers();

						//this.makePageActive(this.getPage());

						//this.updateContent(result.html);
					}

					this.options.onLoad(result, this.contentContainer, firstLoading);
				},
				error: (jqXHR, textStatus, errorThrown) => {
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
		this.load(this.getPage());
	}

	run(page, launch) {
		if (typeof page == 'undefined') {
			page = 1;
		}

		if (typeof launch == 'undefined') {
			launch = true;
		}

		this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
		this.noResultsContainer = this.container.find('.' + this.options.noResultsClass);
		this.loadingLayer = this.container.find('.' + this.options.loadingLayerClass);
        this.filtersList = this.container.find('.' + this.options.filtersListClass);
        this.allItemsAmountContainer = this.container.find('.' + this.options.allItemsAmountValueClass);

		if (launch) {
			this.load(page, true);
		}
	}
}
