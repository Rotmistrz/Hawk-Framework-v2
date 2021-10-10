
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
});
