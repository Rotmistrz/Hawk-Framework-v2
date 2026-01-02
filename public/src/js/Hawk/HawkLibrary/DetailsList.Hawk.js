import Hawk from './Core.Hawk';
import SingleThreadClass from './Basements/SingleThreadClass.Hawk';

export default class DetailsList extends SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);

        this.disabled = false;

		this.current = null;
		this.headers = null;
		this.options = {};

		this.defaultOptions = {
			itemClass: "hawk-details-list__item",
			headerClass: "hawk-details-list__header",
			contentContainerClass: "hawk-details-list__content-container",
			contentClass: "hawk-details-list__content",
			activeClass: "active",

            toggleSelector: null,
            preventToggleSelector: null,

            eventName: "click.detailsList",

            slideSpeed: 200,
            fadeSpeed: 200,

			autoHide: true,

            isDisabled: () => {
                return false;
            },

			getContentContainer: (header) => {
				const item = this.options.getItem(header);

				return item.find('.' + this.options.contentContainerClass);
			},
			getItem: (element) => {
				return element.parents('.' + this.options.itemClass);
			},
			onShow: (dl, header, contentContainer) => {
				header.find('.details-list-item__icon').removeClass('icon-arrow--south').addClass('icon-arrow--north');
			},
			onHide: (dl, header, contentContainer) => {
				header.find('.details-list-item__icon').removeClass('icon-arrow--north').addClass('icon-arrow--south');
			}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

    getCurrent() {
        return this.current;
    }

    getCurrentItem() {
        return this.options.getItem(this.getCurrent());
    }

	show(header) {
		if (this.options.autoHide && this.current != null && !this.current.is(header)) {
			this.hide(this.current);
		}

		this.current = header;

		const contentContainer = this.options.getContentContainer(header);
		contentContainer.velocity("slideDown", {
			duration: this.options.slideSpeed,
			complete: () => {
				this.finishWorking();
			}
		});

		const parent = this.options.getItem(header);
		parent.addClass(this.options.activeClass);

		this.options.onShow(this, header, contentContainer);
	}

	showByIndex(index) {

	}

	hide(header) {
		const contentContainer = this.options.getContentContainer(header);
		contentContainer.velocity("slideUp", {
			duration: this.options.slideSpeed,
			complete: () => {
				this.finishWorking();
			}
		});

		const parent = this.options.getItem(header);
		parent.removeClass(this.options.activeClass);

		this.options.onHide(this, header, contentContainer);
	}

	toggle(header) {
		if (!this.isWorking()) {
			this.startWorking();

			const contentContainer = this.options.getContentContainer(header);

			if (contentContainer.is(':visible')) {
				this.hide(header);
			} else {
				this.show(header);
			}
		}
	}

    hideAll() {
        const contentContainers = this.container.find('.' + this.options.contentContainerClass);

        this.container.find('.' + this.options.contentContainerClass).css({ display: 'none' });

        this.container.find('.' + this.options.itemClass).removeClass(this.options.activeClass);

        this.options.onHide(this, this.headers, contentContainers);
    }

	refreshDependencies() {
		if (this.headers != null) {
			this.headers.unbind(this.options.eventName);
		}

		const that = this;

		this.headers = this.container.find('.' + this.options.headerClass);

		this.headers.bind(this.options.eventName, (e) => {
            if (!this.options.isDisabled()) {
                const header = $(e.currentTarget);

                this.toggle(header);
            }
		});

        $(window).resize(() => {
            if (this.options.isDisabled()) {
                if (!this.disabled) {
                    this.disabled = true;

                    this.hideAll();
                }
            } else {
                this.disabled = false;
            }
        });
	}

	run() {
		this.refreshDependencies();
	}
}
