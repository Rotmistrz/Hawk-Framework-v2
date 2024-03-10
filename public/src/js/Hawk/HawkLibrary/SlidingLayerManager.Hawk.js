import Hawk from './Core.Hawk';

export default class SlidingLayerManager {
	constructor(id, options) {
		this.defaultOptions = {
			sectionClass: "hawk-sliding-layer-section",
			layerClass: "hawk-sliding-layer-section__layer",
			buttonClass: "hawk-sliding-layer-section__button",

			activeClass: "hawk-sliding-layer-section--active",

			managerIDAttrName: "data-sliding-layer-manager",
			IDAttrName: "data-id",

			eventName: "click.slidingLayer",

			actionShow: function(slm, section, layer) {
				section.addClass(slm.options.activeClass);
			},

			actionHide: function(slm, section, layer) {
				section.removeClass(slm.options.activeClass);
			},

			onShow: function(slm, button, layer) {
			},

			onHide: function(slm, button, layer) {
			}
		};

		this.id = id;

		this.options = Hawk.mergeObjects(this.defaultOptions, options);

		this.buttons = null;

		this.button = null;	
		this.section = null;
		this.layer = null;
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

	getSection(id) {
		return $('.' + this.options.sectionClass
			+ '['+ this.options.managerIDAttrName + '="' + this.getID() + '"]')
			.filter('[' + this.options.IDAttrName + '="' + id + '"]');
	}

	isLayerVisible(id) {
		const section = this.getSection(id);

		return section.hasClass(this.options.activeClass);
	}

	show(id) {
		this.button = this.getButton(id);
		this.section = this.getSection(id);

		this.layer = this.section.find('.' + this.options.layerClass);

		this.options.actionShow(this, this.section, this.layer);

		const that = this;

		setTimeout(function() {
			that.options.onShow(that, that.button, that.layer);
		}, 400);
	}

	hide(id) {
		this.button = this.getButton(id);
		this.section = this.getSection(id);

		this.layer = this.section.find('.' + this.options.layerClass);

		this.options.actionHide(this, this.section, this.layer);

		this.options.onHide(this, this.button, this.layer);
	}

	refreshDependencies() {
		const that = this;

		if (this.buttons !== null) {
			this.buttons.unbind(this.options.eventName);
		}

		this.buttons = this.getButtons();

		this.buttons.bind(this.options.eventName, function() {
			let id = $(this).attr(that.options.IDAttrName);

			if (!that.isLayerVisible(id)) {
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