import Hawk from "./Core.Hawk";

export default class Toggler {
    constructor(container, options) {
        this.container = $(container);

        this.defaultOptions = {
            fieldClass: 'hawk-toggler__field',

            onTurnedOn: (toggler) => {},
            onTurnedOff: (toggler) => {},
            turningStateGate: (toggler) => {
                return true;
            }
        };

        this.options = Hawk.mergeObjects(this.defaultOptions, options);
    }

    setState(state) {
        this.state = state;

        if (state == 1) {
            this.options.onTurnedOn(this);
        } else {
            this.options.onTurnedOff(this);
        }
    }

    turnOn() {
        this.setState(1);
    }

    turnOff() {
        this.setState(0);
    }

    run() {
        this.field = this.container.find('.' + this.options.fieldClass);

        const that = this;

        this.field.change(function() {
            console.log($(this).is(':checked'));

            if ($(this).is(':checked')) {
                if (that.options.turningStateGate(that)) {
                    that.turnOn();
                } else {
                    $(that).prop('checked', false);
                }
            } else {
                if (that.options.turningStateGate(that)) {
                    that.turnOff();
                } else {
                    $(that).prop('checked', true);
                }
            }
        });
    }
}
