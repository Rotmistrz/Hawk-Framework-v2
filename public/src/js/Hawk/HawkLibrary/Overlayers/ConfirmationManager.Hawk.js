Hawk.ConfirmationManager = class extends Hawk.AjaxOverlayerManager {
    constructor(container, options) {
        super(container);

        this.actions = {};

        this.defaultOptions = Hawk.mergeWholeObjects(this.defaultOptions, {
            eventName: 'click.confirmationManager',
            mode: Hawk.AjaxOverlayerManagerConstants.modes.DEFAULT,

            bundleAttrName: 'data-bundle',
            actionAttrName: 'data-action',
            buttonClass: 'confirmable-action-button',

            obtainData: (button) => {
                return Hawk.createBundleFromString(button.attr(this.options.bundleAttrName));
            },
            onLoad: (aom, id, result) => {
                const action = aom.getAction(id);

                if (action != null) {
                    console.log("intiailize form");
                    console.log(action);

                    const formBlock = aom.content.find('#' + result.bundle.formID);

                    if (formBlock.length > 0) {
                        const formSender = new Hawk.AjaxFormSender(formBlock, [], action.targetPath, action.callbacks);
                        formSender.run();
                    } else {
                        aom.hide();
                    }
                } else {
                    aom.hide();
                }
            }
        });

        this.options = Hawk.mergeObjects(this.defaultOptions, options);

        console.log(this.defaultOptions);
    }

    getButtonsSelector() {
        return '.' + this.options.buttonClass;
    }

    getAction(name) {
        if (typeof this.actions[name] != 'undefined') {
            return this.actions[name];
        } else {
            return null;
        }
    }

    registerAction(name, targetPath, callbacks) {
        this.actions[name] = {
            name: name,
            targetPath: targetPath,
            callbacks: callbacks
        };

        return this;
    }

    onButtonClick(e) {
        e.preventDefault();
        e.stopPropagation();

        const jQueryThis = $(e.currentTarget);

        const actionName = jQueryThis.attr(this.options.actionAttrName);
        const bundle = this.options.obtainData(jQueryThis);

        console.log(bundle);

        const action = this.getAction(actionName);

        console.log(actionName);
        console.log(action);

        if (action != null) {
            this.load(actionName, {
                'targetPath': action.targetPath,
                ...bundle
            });
        }
    }

    refreshDependencies() {
        if (this.options.mode == Hawk.AjaxOverlayerManagerConstants.modes.DELEGATE_EVENTS) {
            this.body.on('click', this.getButtonsSelector(), this.onButtonClick.bind(this));
        } else {
            if (typeof this.buttons != 'undefined') {
                this.buttons.unbind(this.options.eventName);
            }

            this.buttons = $(this.getButtonsSelector());

            this.buttons.bind(this.options.eventName, this.onButtonClick.bind(this));
        }
    }
}