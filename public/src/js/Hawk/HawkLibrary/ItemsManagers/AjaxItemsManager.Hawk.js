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

			slideSpeed: 400,
			fadeSpeed: 400,

			updateContent: function(contentContainer, items) {
				contentContainer.html(items);
			},

			onLoad: function(contentContainer) {},
			onError: function(contentContainer) {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
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

	load(page) {
		this.setPage(page);

		if (!this.isWorking()) {
			this.startWorking();

			this.setRequest($.ajax({
	            type: "POST",
	            url: this.options.path,
	            dataType: "json",
	            data: {
	                'page': this.page,
	                'itemsPerPage': this.options.itemsPerPage
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

	run(page) {
		if (typeof page == 'undefined') {
			page = 1;
		}

		this.contentContainer = this.container.find('.' + this.options.contentContainerClass);

		this.load(page);
	}
}