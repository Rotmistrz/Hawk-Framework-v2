Hawk.MoreContentManager = class {
	constructor(id, options) {
		this.defaultOptions = {
			buttonClass: "hawk-more-content-button",
			buttonContentClass: "hawk-more-content-button__content",
			contentClass: "hawk-more-content",

			IDAttrName: "data-id",
			managerIDAttrName: "data-more-content-manager",
			buttonOppositeTextAttr: "data-opposite-text",

			eventName: "click.moreContent",

			actionShow: function(content) {
				if (!content.is(":visible")) {
					content.velocity("slideDown");
				}
			},

			actionHide: function(content) {
				if (content.is(":visible")) {
					content.velocity("slideUp");
				}
			},

			onShow: function(mcm, button, content) {
				mcm.toggleButtonText(button);
			},

			onHide: function(mcm, button, content) {
				mcm.toggleButtonText(button);
			}
		}

		this.id = id;

		this.options = Hawk.mergeObjects(this.defaultOptions, options);

		this.buttons = null;
		this.content = null;
	}

	getID() {
		return this.id;
	}

	getButtons() {
		return $('.' + this.options.buttonClass
			+ '['+ this.options.managerIDAttrName + '="' + this.getID() + '"]');
	}

	getButton(id) {
		return $('.' + this.options.buttonClass
			+ '['+ this.options.managerIDAttrName + '="' + this.getID() + '"]')
			.filter('[' + this.options.IDAttrName + '="' + id + '"]');
	}

	getContent(id) {
		return $('.' + this.options.contentClass
			+ '['+ this.options.managerIDAttrName + '="' + this.getID() + '"]')
			.filter('[' + this.options.IDAttrName + '="' + id + '"]');
	}

	isContentVisible(id) {
		const content = this.getContent(id);

		return content.is(':visible');
	}

	toggleButtonText(button) {
		const oppositeText = button.attr(this.options.buttonOppositeTextAttr);
		const buttonContent = button.find('.' + this.options.buttonContentClass);

		button.attr(this.options.buttonOppositeTextAttr, buttonContent.text());
		buttonContent.text(oppositeText);
	}

	show(id) {
		this.button = this.getButton(id);
		this.content = this.getContent(id);

		this.options.actionShow(this.content);

		this.options.onShow(this, this.button, this.content);
	}

	hide(id) {
		this.button = this.getButton(id);
		this.content = this.getContent(id);

		this.options.actionHide(this.content);

		this.options.onHide(this, this.button, this.content);
	}

	refreshDependencies() {
		if (this.buttons !== null) {
			this.buttons.unbind(this.options.eventName);
		}

		const that = this;

		this.buttons = this.getButtons();

		console.log(this.buttons);

		this.buttons.bind(this.options.eventName, function() {
			let id = $(this).attr(that.options.IDAttrName);

			if (!that.isContentVisible(id)) {
				that.show(id);
			} else {
				that.hide(id);
			}
		});
	}

	run() {
		this.refreshDependencies();
	}
}