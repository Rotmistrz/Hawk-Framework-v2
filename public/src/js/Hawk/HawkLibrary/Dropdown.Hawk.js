Hawk.DropdownConstants = {
    Modes: {
        PLAIN: 0,
        CHOOSABLE: 1
    },

    Types: {
        OVERLAYER: 0,
        EXPANDING: 1
    },

    Directions: {
        DOWNWARDS: 0,
        UPWARDS: 1
    }
}

Hawk.RegisteredDropdowns = [];

Hawk.Dropdown = function(container, options) {
    var that = this;

    this.container = $(container).first();

    this.header;
    this.title;
    this.list;
    this.listContainer;

    this.startEscapeSensor;
    this.sensor;
    this.endSensor;
    this.escapeSensor;

    this.fields;

    this.states = {
        CLOSED: 0,
        OPEN: 1
    }

    this.defaultOptions = {
        slideSpeed: 400,

        type: Hawk.DropdownConstants.Types.OVERLAYER,
        direction: Hawk.DropdownConstants.Directions.DOWNWARDS,

        containerClass: 'hawk-dropdown',
        expandingTypeClass: 'hawk-dropdown--expanding',
        upwardsDirectionClass: 'hawk-dropdown--upwards',
        openClass: 'hawk-dropdown--open',
        headerClass: 'hawk-dropdown__header',
        titleClass: 'hawk-dropdown__title',
        listClass: 'hawk-dropdown__list',
        listContainerClass: 'hawk-dropdown__list-container',

        startEscapeSensorClass: 'hawk-dropdown__start-escape-sensor',
        sensorClass: 'hawk-dropdown__sensor',
        endSensorClass: 'hawk-dropdown__end-sensor',
        escapeSensorClass: 'hawk-dropdown__escape-sensor',

        onShow: function(dropdown) {},
        onHide: function(dropdown) {},
        onSelected: function(dropdown, field) {
            if (field.attr('type') == 'radio') {
                var description = field.parent().find('.dropdown-item__description').html();

                dropdown.title.html(description);

                dropdown.hide();
            }

            return true;
        }
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.state = this.states.CLOSED;

    this.mode = this.options.mode;
    this.type = this.options.type;

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
        return this.listContainer.get(0).offsetHeight < this.listContainer.get(0).scrollHeight;
    }

    this.show = function() {
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

        for (const dropdown of Hawk.RegisteredDropdowns) {
            if (dropdown.isOpen() && dropdown != this) {
                dropdown.hide();
            }
        }

        this.setOpen();

        return this;
    }

    this.hide = function() {
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

        this.setClosed();

        return this;
    }

    this.select = function(field) {
        if (field.length > 0) {
            return this.options.onSelected(this, field);
        } else {
            return false;
        }
    }

    this.selectByIndex = function(index) {
        const field = this.fields.eq(index);

        return this.select(field);
    }

    this.selectByValue = function(value) {
        const field = this.fields.filter(function() {
            return $(this).val() == value;
        });

        return this.select(field);
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
                if (typeof that.options.onSelected == 'function') {
                    that.options.onSelected(that, $(this));
                }
            });
        }
    }

    this.checkFields = function() {
        const fields = this.fields.filter(":checked");

        if (fields.length > 0) {
            this.select(fields);
        }
    }

    this.run = function() {
        this.header = this.container.find('.' + this.options.headerClass);
        this.title = this.container.find('.' + this.options.titleClass);
        this.list = this.container.find('.' + this.options.listClass);
        this.listContainer = this.container.find('.' + this.options.listContainerClass);

        this.sensor = this.createSensor(this.options.sensorClass);
        this.container.prepend(this.sensor);

        this.startEscapeSensor = this.createSensor(this.options.startEscapeSensorClass);
        this.container.prepend(this.startEscapeSensor); //.find('.' + this.options.startEscapeSensorClass);
         ///.find('.' + this.options.sensorClass);

        this.endSensor = this.createSensor(this.options.endSensorClass);
        this.container.append(this.endSensor); //.find('.' + this.options.endSensorClass);

        this.escapeSensor = this.createSensor(this.options.escapeSensorClass);
        this.container.append(this.escapeSensor);   //.find('.' + this.options.escapeSensorClass);

        if (this.options.type === Hawk.DropdownConstants.Types.EXPANDING) {
            this.container.addClass(this.options.expandingTypeClass);
        }

        if (this.options.direction === Hawk.DropdownConstants.Directions.UPWARDS) {
            this.container.addClass(this.options.upwardsDirectionClass);
        }

        this.hide();

        this.container.click(function(e) {
            e.stopPropagation();
        });

        this.header.click(function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (that.isOpen()) {
                that.hide();
            } else {
                that.show();
            }
        });

        this.startEscapeSensor.focus(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });

        this.sensor.focus(function() {
            if (!that.isOpen()) {
                that.show();
            }
        });

        this.endSensor.focus(function() {
            if (!that.isOpen()) {
                that.show();
            }
        });

        this.escapeSensor.focus(function() {
            if (that.isOpen()) {
                that.hide();
            }
        });

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