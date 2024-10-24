import Hawk from '../Core.Hawk';
import DropdownType from './Enums/DropdownType.Hawk';
import DropdownDirection from './Enums/DropdownDirection.Hawk';

export default function Dropdown(container, options) {
    var that = this;

    this.container = $(container).first();

    this.header;
    this.title;
    this.list;
    this.listContainer;
    this.searchingField;

    this.startEscapeSensor;
    this.sensor;
    this.endSensor;
    this.escapeSensor;

    this.fields;

    this.disabled = false;

    this.states = {
        CLOSED: 0,
        OPEN: 1
    }

    this.defaultOptions = {
        slideSpeed: 200,

        type: DropdownType.OVERLAYER,
        direction: DropdownDirection.DOWNWARDS,

        containerClass: 'hawk-dropdown',
        expandingTypeClass: 'hawk-dropdown--expanding',
        upwardsDirectionClass: 'hawk-dropdown--upwards',
        openClass: 'hawk-dropdown--open',
        headerClass: 'hawk-dropdown__header',
        titleClass: 'hawk-dropdown__title',
        listClass: 'hawk-dropdown__list',
        listContainerClass: 'hawk-dropdown__list-container',
        searchingFieldClass: 'hawk-dropdown__searching-field',

        disabledClass: 'disabled',

        startEscapeSensorClass: 'hawk-dropdown__start-escape-sensor',
        sensorClass: 'hawk-dropdown__sensor',
        endSensorClass: 'hawk-dropdown__end-sensor',
        escapeSensorClass: 'hawk-dropdown__escape-sensor',

        onShow: function(dropdown) {},
        onShowing: function(dropdown) {},
        onHide: function(dropdown) {},
        onHiding: function(dropdown) {},
        onSelected: function(dropdown, field, silently) {
            if (field.attr('type') == 'radio') {
                var description = field.parent().find('.dropdown-item__description').html();

                dropdown.title.html(description);

                dropdown.hide();
            }

            return true;
        },
        onChanged: function(dropdown, field) {

        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.state = this.states.CLOSED;

    this.mode = this.options.mode;
    this.type = this.options.type;

    this.isDisabled = function() {
        return this.disabled;
    }

    this.disable = function() {
        this.disabled = true;
        this.container.addClass(this.options.disabledClass);

        return this;
    }

    this.enable = function() {
        this.disabled = false;
        this.container.removeClass(this.options.disabledClass);

        return this;
    }

    this.clearFields = function() {
        this.fields.each(function() {
           $(this).prop('checked', false);
        });

        return this;
    }

    this.setOpen = function() {
        this.state = this.states.OPEN;

        return this;
    }

    this.setClosed = function() {
        this.state = this.states.CLOSED;

        return this;
    }

    this.isOpen = function() {
        return this.state == this.states.OPEN;
    }

    this.doesNeedScrollbar = function() {
        return this.listContainer.get(0).offsetHeight < this.list.get(0).scrollHeight;
    }

    this.show = function() {
        this.enableSearchingField();
        this.container.addClass(that.options.openClass);

        this.listContainer.velocity("slideDown", {
            duration: that.options.slideSpeed,
            easing: "linear",
            complete: () => {
                if (this.doesNeedScrollbar()) {
                    this.listContainer.mCustomScrollbar();
                }

                if (typeof that.options.onShow === 'function') {
                    that.options.onShow(that);
                }
            }
        });

        if (typeof that.options.onShowing === 'function') {
            that.options.onShowing(that);
        }

        for (const dropdown of Hawk.RegisteredDropdowns) {
            if (dropdown.isOpen() && dropdown != this) {
                dropdown.hide();
            }
        }

        this.setOpen();

        return this;
    }

    this.hide = function() {
        this.clearSearchingField();
        this.disableSearchingField();

        this.container.removeClass(that.options.openClass);

        this.listContainer.velocity("slideUp", {
            duration: that.options.slideSpeed,
            easing: "linear",
            complete: function() {
                if (typeof that.options.onHide === 'function') {
                    that.options.onHide(that);
                }
            }
        });

        if (typeof that.options.onHiding === 'function') {
            that.options.onHiding(that);
        }

        this.setClosed();
        this.showAllItems();

        return this;
    }

    this.select = function(field, silently) {
        if (field.length > 0) {
            return this.options.onSelected(this, field, silently);
        } else {
            return false;
        }
    }

    this.selectByIndex = function(index, silently) {
        const field = this.fields.eq(index);

        return this.select(field, silently);
    }

    this.selectByValue = function(value, silently) {
        const field = this.fields.filter(function() {
            return $(this).val() == value;
        });

        return this.select(field, silently);
    }

    this.createSensor = function(className) {
        var sensor = $('<input type="checkbox" />');
        sensor.addClass(className);

        return sensor;
    }

    this.refreshDependencies = function() {
        this.fields = this.list.find('input[type="radio"], input[type="checkbox"]');

        if (this.fields.length > 0) {
            this.fields.change(function() {
                if (typeof that.options.onChanged == 'function') {
                    that.options.onChanged(that, $(this));
                }

                if (typeof that.options.onSelected == 'function') {
                    that.options.onSelected(that, $(this));
                }
            });
        }

        return this;
    }

    this.checkFields = function() {
        const fields = this.fields.filter(":checked");

        if (fields.length > 0) {
            this.select(fields);
        }
    }

    this.clearSearchingField = function() {
        this.searchingField.val("");

        return this;
    }

    this.disableSearchingField = function() {
        this.searchingField.attr('disabled', 'disabled');

        return this;
    }

    this.isSearchingFieldDisabled = function() {
        return this.searchingField.is(':disabled');
    }

    this.enableSearchingField = function() {
        this.searchingField.removeAttr('disabled');
        this.searchingField.focus();

        return this;
    }

    this.showAllItems = function() {
        this.list.children().css({ display: 'block' });

        return this;
    }

    this.searchingFieldExist = function() {
        return this.searchingField.length > 0;
    }

    this.run = function() {
        const that = this;

        this.header = this.container.find('.' + this.options.headerClass);
        this.title = this.container.find('.' + this.options.titleClass);
        this.list = this.container.find('.' + this.options.listClass);
        this.listContainer = this.container.find('.' + this.options.listContainerClass);
        this.searchingField = this.container.find('.' + this.options.searchingFieldClass);

        this.sensor = this.createSensor(this.options.sensorClass);
        this.container.prepend(this.sensor);

        this.startEscapeSensor = this.createSensor(this.options.startEscapeSensorClass);
        this.container.prepend(this.startEscapeSensor); //.find('.' + this.options.startEscapeSensorClass);
         ///.find('.' + this.options.sensorClass);

        this.endSensor = this.createSensor(this.options.endSensorClass);
        this.container.append(this.endSensor); //.find('.' + this.options.endSensorClass);

        this.escapeSensor = this.createSensor(this.options.escapeSensorClass);
        this.container.append(this.escapeSensor);   //.find('.' + this.options.escapeSensorClass);

        if (this.options.type === DropdownType.EXPANDING) {
            this.container.addClass(this.options.expandingTypeClass);
        }

        if (this.options.direction === DropdownDirection.UPWARDS) {
            this.container.addClass(this.options.upwardsDirectionClass);
        }

        this.hide();

        this.container.click(function(e) {
            e.stopPropagation();
        });

        this.header.add(this.searchingField).click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (that.isOpen()) {
                that.hide();
            } else if (!that.isDisabled()) {
                that.show();
            }
        });

        this.startEscapeSensor.focus(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });

        this.sensor.focus(function() {
            if (!that.isOpen() && !that.isDisabled()) {
                that.show();
            }
        });

        this.endSensor.focus(function() {
            if (!that.isOpen() && !that.isDisabled()) {
                that.show();
            }
        });

        this.escapeSensor.focus(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });

        if (this.searchingFieldExist()) {
            this.searchingField.keydown(function() {
                const thisthis = $(this);

                setTimeout(function() {
                    const value = thisthis.val().trim().toLowerCase();

                    if (value.length > 0 && !that.isSearchingFieldDisabled()) {
                        that.list.children().each(function() {
                            if ($(this).text().trim().toLowerCase().includes(value)) {
                                $(this).css({ display: 'block' });
                            } else {
                                $(this).css({ display: 'none' });
                            }
                        });
                    } else {
                        that.showAllItems();
                    }
                }, 200);
            });
        }

        // this.sensor.blur(function() {
        //     setTimeout(function() {
        //         if (that.fields.filter(':focus').length === 0 && that.isOpen()) {
        //             that.hide();
        //         }
        //     }, 100);
        // });
        //
        // this.fields.blur(function() {
        //     setTimeout(function() {
        //         if (that.fields.add(that.sensor).filter(':focus').length === 0 && that.isOpen()) {
        //             that.hide();
        //         }
        //     }, 100);
        // });

        $('body').click(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });

        this.refreshDependencies();
        this.checkFields();

        Hawk.RegisteredDropdowns.push(this);

        return true;
    }
}