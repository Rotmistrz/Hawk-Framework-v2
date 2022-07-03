Hawk.DetailsList = class extends Hawk.SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);

		this.current = null;
		this.headers = null;
		this.options = {};

		this.defaultOptions = {
			itemClass: "hawk-details-list__item",
			headerClass: "hawk-details-list__header",
			contentContainerClass: "hawk-details-list__content-container",
			contentClass: "hawk-details-list__content",

			eventName: "click.detailsList",

			autoHide: true,
			getContentContainer: (header) => {
				return header.siblings('.' + this.options.contentContainerClass);
			},

			slideSpeed: 200,
			fadeSpeed: 200,

			onShow: (dl, header, contentContainer) => {
				header.find('.details-list-item__icon').removeClass('icon-arrow--south').addClass('icon-arrow--north');
			},
			onHide: (dl, header, contentContainer) => {
				header.find('.details-list-item__icon').removeClass('icon-arrow--north').addClass('icon-arrow--south');
			}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	show(header) {
		if (this.options.autoHide && this.current != null) {
			this.hide(this.current);
		}

		this.current = header;

		const contentContainer = this.options.getContentContainer(header);
		contentContainer.velocity("slideDown", {
			duration: this.options.slideSpeed
		});

		this.options.onShow(this, header, contentContainer);
	}

	showByIndex(index) {

	}

	hide(header) {
		const contentContainer = this.options.getContentContainer(header);
		contentContainer.velocity("slideUp", {
			duration: this.options.slideSpeed
		});

		this.options.onHide(this, header, contentContainer);
	}

	refreshDependencies() {
		if (this.headers !== null) {
			this.headers.unbind(this.options.eventName);
		}

		const that = this;

		this.headers = this.container.find('.' + this.options.headerClass);

		this.headers.bind(this.options.eventName, function() {
			const header = $(this);
			const contentContainer = that.options.getContentContainer(header);

			if (contentContainer.is(':visible')) {
				that.hide(header);
			} else {
				that.show(header);
			}
		});
	}

	run() {
		this.refreshDependencies();
	}
}