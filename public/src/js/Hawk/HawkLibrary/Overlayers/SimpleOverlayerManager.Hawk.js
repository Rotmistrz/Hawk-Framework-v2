import Hawk from '../Core.Hawk';
import OverlayerManager from "./OverlayerManager.Hawk";
import RequestStatus from "../Requests/RequestStatus.Hawk";

export default class SimpleOverlayerManager extends OverlayerManager {
    constructor(container, options) {
        super(container, options);

        this.defaultOptions = Hawk.mergeWholeObjects(this.defaultOptions, {
            buttonClass: 'simple-overlayer-button',
            contentToLoadClass: 'simple-overlayer-content'
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

            var contentToLoad = $('.' + this.options.contentToLoadClass + '[data-id="' + id + '"]').clone();

            const result = {
                id: id,
                html: contentToLoad.html(),
                status: RequestStatus.SUCCESS
            };

            this.actionLoad(id, result);

            this.finishWorking();

            this.loadingLayer.css({ display: 'none' });
        }
    }
}
