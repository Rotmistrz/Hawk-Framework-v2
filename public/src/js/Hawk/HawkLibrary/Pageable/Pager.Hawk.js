import Hawk from "../Core.Hawk";

export default class Pager {
	constructor(container, options) {
		this.defaultOptions = {
			pagesVisibilityLimit: 8,
			visiblePagesNumber: 5,
			edgeVisiblePagesNumber: 4,

			activeClass: "active",
			pagesContainerClass: "hawk-pager__pages",
			previousButtonClass: "hawk-pager__previous",
			nextButtonClass: "hawk-pager__next",
			pagerItemClass: "pager-item",

			clickEventName: "click.pager",
			pageNrAttr: "data-page-nr",

			createItem: function(nr) {
	            return $("<li class=\"std-pager__item\"><div class=\"pager-item\" data-page-nr=\"" + nr +"\">" + nr + "</div></li>");
	        },
	        createSeparator: function() {
	            return $("<li class=\"std-pager__separator\"><div class=\"pager-item-separator\">...</div></li>");
	        },

			onPageChanged: function(pager, nr, bySystem) {
			},

            onControlActivityChange: (control, isActive) => {
                if (isActive) {
                    control.css({ visibility: "visible" });
                } else {
                    control.css({ visibility: "hidden" });
                }
            }
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);

		this.container = $(container);
		this.pagesContainer;

		this.controls = {};

		this.pagesNumber = 1;
		this.page = 1;

		this.pages;
	}

	getPage() {
		// return this.page;
		return parseInt(this.page);
	}

	setPage(page) {
		this.page = page;

		return this;
	}

	updatePage(page, bySystem) {
		if (typeof bySystem == 'undefined') {
			bySystem = true;
		}

		this.setPage(page);

		this.markAsActive(page);

		if (this.shouldBeRebuilt(page)) {
			this.rebuild();
		} else {
			this.checkDependencies();
		}

		if (typeof this.options.onPageChanged == 'function') {
			this.options.onPageChanged(this, this.getPage(), bySystem);
		}

		return this;
	}

	getPagesNumber() {
		return this.pagesNumber;
	}

	setPagesNumber(pagesNumber) {
		this.pagesNumber = pagesNumber;

		return this;
	}

	checkDependencies() {
        this.options.onControlActivityChange(this.controls.previous, !this.isFirstPage());
        this.options.onControlActivityChange(this.controls.next, !this.isLastPage());
	}

	previous(bySystem) {
		return this.updatePage(this.getPage() - 1, bySystem);
	}

	next(bySystem) {
		return this.updatePage(this.getPage() + 1, bySystem);
	}

	create(pagesNumber) {
		let pages = $();
		const page = this.getPage();

		if (pagesNumber <= this.options.pagesVisibilityLimit) {
			for (let i = 1; i <= pagesNumber; i++) {
				pages = pages.add(this.options.createItem(i));
			}
		} else if (this.isOnEdge(page)) {
			for (let i = 1; i <= this.options.edgeVisiblePagesNumber; i++) {
				pages = pages.add(this.options.createItem(i));
			}

			pages = pages.add(this.options.createSeparator());

			for (let i = pagesNumber - this.options.edgeVisiblePagesNumber + 1; i <= pagesNumber; i++) {
				pages = pages.add(this.options.createItem(i));
			}
		} else {
			let previousBound = page - Math.floor(this.options.visiblePagesNumber / 2);

            if (previousBound < 1) {
                previousBound = 1;
            }

			let rangeEnd = previousBound + this.options.visiblePagesNumber;

            if (previousBound > 1) {
                pages = pages.add(this.options.createSeparator());
            }

			for (let i = previousBound; i < rangeEnd; i++) {
				pages = pages.add(this.options.createItem(i));
			}

			pages = pages.add(this.options.createSeparator());
		}

		return pages;
	}

	isOnEdge(page) {
		return (page < this.options.edgeVisiblePagesNumber)
			|| (page > (this.getPagesNumber() - this.options.edgeVisiblePagesNumber + 1));
	}

	isFirstPage() {
		return this.getPage() == 1 || this.getPage() == 0;
		// return this.getPage() == 1;
	}

	isLastPage() {
		// return this.getPage() == this.getPagesNumber();
		return this.getPage() == this.getPagesNumber() || this.getPagesNumber() == 0;
	}

	isPageVisible(page) {
		return this.pages.find("[" + this.options.pageNrAttr + "=\"" + page + "\"]").length > 0;
	}

	shouldBeRebuilt(page) {
		return !this.isPageVisible(page) || !this.isPageVisible(page - 1) || !this.isPageVisible(page + 1);
	}

	build(pagesNumber) {
		this.setPagesNumber(pagesNumber);

		if (typeof this.pages != 'undefined') {
			this.pages.unbind(this.options.clickEventName);
		}

		this.pages = this.create(pagesNumber);

		this.pagesContainer.html('');
		this.pagesContainer.append(this.pages);

		this.pages.find('.' + this.options.pagerItemClass).bind('click', (e) => {
			e.preventDefault();

			const jQueryThis = $(e.currentTarget);
			const page = jQueryThis.attr(this.options.pageNrAttr);

			this.updatePage(page, false);
		});

		this.checkDependencies();
	}

	rebuild() {
		this.build(this.getPagesNumber());

		this.markAsActive(this.getPage());
	}

	markAsActive(nr) {
		this.pages.find('.' + this.options.pagerItemClass).removeClass(this.options.activeClass);

		this.pages.find('.' + this.options.pagerItemClass + "[" + this.options.pageNrAttr + "=\"" + nr + "\"]").addClass(this.options.activeClass);
	}

	run(pagesNumber) {
		this.pagesContainer = this.container.find('.' + this.options.pagesContainerClass);

		this.controls = {
			previous: this.container.find('.' + this.options.previousButtonClass),
			next: this.container.find('.' + this.options.nextButtonClass)
		};

		this.build(pagesNumber);

		this.markAsActive(this.getPage());

		this.controls.previous.click((e) => {
            if (!this.isFirstPage()) {
                this.previous(false);
            }
		});

		this.controls.next.click((e) => {
            if (!this.isLastPage()) {
                this.next(false);
            }
		});
	}
}
