import Hawk from "./Core.Hawk";

export default class EnlargingObject {
	constructor(container, options) {
		this.container = $(container);

		this.defaultOptions = {
			objectClass: "enlarging-object__core",
			buttonClass: "enlarging-object__button",
			closeButtonClass: "enlarging-object__close-button",

			getProportion: (width) => {
				if (width >= 1700) {
					return 0.75;
				} else if (width >= 1300) {
					return 0.75;
				} else if (width >= 768) {
					return 0.9;
				} else {
					return 1;
				}
			},

			getTopDistance: (width) => {
				return "-50%";
			},

			onEnlarge: (container, object) => {},
			onNormalize: (container, object) => {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);

		this.object = this.container.find('.' + this.options.objectClass);
		this.button = this.container.find('.' + this.options.buttonClass);
		this.closeButton = this.container.find('.' + this.options.closeButtonClass);

		this.enlarged = false;

		this.savedDimensions = {};
	}

	isEnlarged() {
		return this.enlarged;
	}

	saveDimensions(container) {
		this.savedDimensions = {
			width: container.css('width'),
			height: container.css('height')
		};
	}

	restoreDimensions(container) {
		container.css({ width: this.savedDimensions.width, height: this.savedDimensions.height });
	}

	disableDragging(e) {
		e.preventDefault();
        e.stopPropagation();
	}

	enlarge() {
		this.enlarged = true;

        const componentWidth = this.object.outerWidth();

        this.container.css({ width: componentWidth + "px", height: this.object.outerHeight() + "px" });

        const finalWidth = this.options.getProportion(Hawk.w) * Hawk.w;

        this.object.css({ top: this.options.getTopDistance(this, finalWidth), width: finalWidth + "px", left: -((finalWidth - componentWidth) / 2) + "px" });

        this.options.onEnlarge(this.container, this.object);

        this.object.on('mousedown', this.disableDragging);
	}

	normalize() {
		this.enlarged = false;

		this.options.onNormalize(this.container, this.object);

		this.object.css({ width: "100%", left: 0, top: 0 });

		this.container.css({ width: "auto", height: "auto" });

		this.object.off('mousedown', this.disableDragging);
	}

	run() {
		this.button.click((e) => {
			e.stopPropagation();

			if (!this.isEnlarged()) {
				this.enlarge();
			} else {
				this.normalize();
			}
		});

		this.closeButton.click((e) => {
			e.stopPropagation();
			
			this.normalize();
		});
	}
}