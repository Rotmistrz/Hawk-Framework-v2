
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

    const mycar = new Car("Opel Vectra", 2005);

    console.log(mycar);
    console.log(mycar.getModel());
    console.log("blabla");

    const opel = new Opel(2007, "benzyna");
    console.log(opel);
    console.log(opel.getModel());
    console.log(opel.year);
    opel.printEngine();

    // blabla
});
