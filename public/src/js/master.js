
class Car {
    constructor(model, year) {
        this.model = model;
        this.year = year;
    }

    getModel() {
        return this.model;
    }
}

class Opel extends Car {
    constructor(year, engine) {
        super("Opel", year);

        this.engine = engine;
    }

    printEngine() {
        console.log(this.engine);
    }
}

$(document).ready(function() {
    var HawkExamples = {};

    HawkExamples.exemplaryDropdown = new Hawk.Dropdown($('#exemplary-dropdown'));
    HawkExamples.exemplaryDropdown.run();

    HawkExamples.expandingDropdown = new Hawk.Dropdown($('#expanding-dropdown'), {
        type: Hawk.DropdownConstants.Types.EXPANDING
    });
    HawkExamples.expandingDropdown.run();

    HawkExamples.layeredSection = new Hawk.LayeredSection($('#exemplary-layered-section'));
    HawkExamples.layeredSection.run();

    HawkExamples.moreContentManager = new Hawk.MoreContentManager(1, {});
    HawkExamples.moreContentManager.run();

    $('.scrollable-section').mCustomScrollbar({
                axis: "y",
                setTop: 0
            });

    HawkExamples.slidingLayerManager = new Hawk.SlidingLayerManager(1, {
        onShow: function(slm, button, layer) {
            var content = layer.find('.edge-section__content');
            var currentHeight = parseInt(content.innerHeight()) - parseInt(content.css('paddingTop')) - parseInt(content.css('paddingBottom'));

            layer.find('.scrollable-section').css({ height: currentHeight + "px" }).mCustomScrollbar({
                axis: "y"
            });
        }
    });
    HawkExamples.slidingLayerManager.run();

    var HawkVariables = {};

    HawkVariables.colorFieldsController = new Hawk.FieldController($('.colors-section input'), {
        onChange: function(field, value) {
            console.log(field, value);

            const label = field.parents('.form-field');

            console.log(label);

            label.find('.color-sample').css({ backgroundColor: value });
        }
    });
    HawkVariables.colorFieldsController.run();
    // blabla
});
