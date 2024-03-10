import Hawk from "../Core.Hawk";

export default class StepsManager {
    constructor(container, options) {
        this.defaultOptions = {
            stepClass: 'hawk-steps-manager__step',
            activeClass: 'active'
        };

        this.container = $(container);
        this.steps = null;

        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }

    clearSteps() {
        this.steps.removeClass(this.options.activeClass);

        return this;
    }

    markStepAsActive(nr) {
        this.clearSteps();

        for (let i = 0; i < nr; i++) {
            this.steps.eq(i).addClass(this.options.activeClass);
        }
    }

    run() {
        this.steps = this.container.find('.' + this.options.stepClass);
    }
}