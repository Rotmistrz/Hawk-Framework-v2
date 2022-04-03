Hawk.AjaxOverlayerManager = class extends Hawk.SingleThreadClass {
	constructor(container, options) {
		super();

		this.container = $(container);
		this.overlayerID = this.container.attr('data-overlayer-id');

		this.open = false;

		this.body;
		this.lang;

		this.contentContainer;
		this.content;
		this.closeButton;

		this.defaultOptions = {
			path: "/ajax/load-overlayer",

			fadeSpeed: 200,
			slideSpeed: 200,

			wrapperClass: 'overlayer__wrapper',
			innerClass: 'overlayer__inner',
			contentContainerClass: 'overlayer__content-container',
			contentClass: 'overlayer__content',

			loadingLayerClass: 'overlayer__loading-layer',
			closeButtonClass: 'ajax-overlayer-close',

			onLoad: (aom, id, bundle) => {}
		};

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	getOverlayerID() {
		return this.overlayerID;
	}

	getLang() {
		return this.lang;
	}

	getButtonsSelector() {
		return '.ajax-overlayer-button[data-overlayer-id="' + this.getOverlayerID() + '"]';
	}

	hide() {
		if (this.isWorking()) {
			this.abortRequest();
		}

		this.container.velocity("fadeOut", {
			duration: this.options.fadeSpeed,
			complete: () => {
				this.body.css({ overflow: 'auto' });

				this.contentContainer.hide();
				this.content.html("");
			}
		});
	}

	show() {
		this.container.velocity("fadeIn", {
			duration: this.options.fadeSpeed,
			complete: () => {
				this.body.css({ overflow: 'hidden' });
			}
		});
	}

	load(id, bundle) {
		if (!this.isWorking()) {
			this.startWorking();

			this.show();

			if (typeof bundle == 'undefined') {
				bundle = {};
			}

			this.setRequest($.ajax({
	            type: "POST",
	            url: this.options.path,
	            dataType: "json",
	            data: { id: id, bundle: bundle, lang: this.getLang() },
	            success: (result) => {
	            	//console.log(result);

	            	if (result.status == Hawk.RequestStatus.SUCCESS) {
	            		let finalCallback = () => {};

	            		if (typeof this.options.onLoad == 'function') {
	            			finalCallback = () => {
	            				this.options.onLoad(this, id, result);
	            			}
	            		}

	            		this.changeContent(result.html, finalCallback);
	            		
	            	} else {
	            		this.hide();
	            	}
	            },
	            error: function(jqXHR, textStatus, errorThrown) {
	                // here should appear error layer
	                //alert(errorThrown);

	                console.log(jqXHR.responseText);
	            },
	            complete: () => {
	                this.finishWorking();
	            }
	        }));
		}
	}

	changeContent(content, callback) {
		this.content.css({ opacity: 0 });
		this.content.html(content);
		this.contentContainer.velocity("slideDown", {
			duration: this.options.slideSpeed,
			complete: () => {
				this.content.velocity({ opacity: 1 }, {
					duration: this.options.fadeSpeed,
					complete: () => {
						if (typeof callback == 'function') {
							callback();
						}
					}
				});
			}
		});
	}

	onButtonClick(e) {
		e.preventDefault();
		e.stopPropagation();

		const jQueryThis = $(e.currentTarget);

		const id = jQueryThis.attr('data-id');
		var bundleString;

		if (typeof jQueryThis.attr('data-bundle') != 'undefined') {
			bundleString = Hawk.createBundleFromString(jQueryThis.attr('data-bundle'));
		} else {
			bundleString = {};
		}

		this.load(id, bundleString);
	}

	initializeClosePreventer() {
		this.container.on('click', '.' + this.options.contentContainerClass + ', .' + this.options.contentContainerClass + ':not(.' + this.options.closeButtonClass + ')', (e) => {
			e.stopPropagation();

			return;
		});

		return this;
	}

	run() {
		this.body = $('body');
		this.lang = $('html').attr('lang');

		this.contentContainer = this.container.find('.' + this.options.contentContainerClass);
		this.content = this.container.find('.' + this.options.contentClass);
		this.closeButton = this.container.find('.' + this.options.closeButtonClass);

		this.body.on('click', this.getButtonsSelector(), this.onButtonClick.bind(this));

		this.container.click((e) => {
			this.hide();
		});

		this.container.on('click', '.' + this.options.closeButtonClass, (e) => {
			this.hide();
		});

		this.initializeClosePreventer();
	}
}