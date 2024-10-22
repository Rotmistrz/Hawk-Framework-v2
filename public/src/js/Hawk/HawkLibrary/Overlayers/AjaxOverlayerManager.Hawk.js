import Hawk from '../Core.Hawk';
import OverlayerManager from './OverlayerManager.Hawk';

export default class AjaxOverlayerManager extends OverlayerManager {
	constructor(container, options) {
		super(container, options);

		this.defaultOptions = Hawk.mergeWholeObjects(this.defaultOptions, {
			path: "/ajax/load-overlayer",

			buttonClass: 'ajax-overlayer-button'
		});

		this.options = Hawk.mergeObjects(this.defaultOptions, options);
	}

	loadContent(id, bundle) {
		if (!this.isWorking()) {
			this.startWorking();

			if (typeof bundle == 'undefined') {
				bundle = {};
			}

			this.loadingLayer.css({ display: 'flex' });

			this.setRequest($.ajax({
				type: "POST",
				url: this.options.path,
				dataType: "json",
				data: { id: id, bundle: bundle, lang: this.getLang() },
				success: (result) => {
					this.actionLoad(id, result);
				},
				error: (jqXHR, textStatus, errorThrown) => {
					// here should appear error layer
					//alert(errorThrown);

					this.hide();

					this.options.onError(jqXHR.responseText);
				},
				complete: () => {
					this.finishWorking();

					this.loadingLayer.css({ display: 'none' });
				}
			}));
		}
	}
}