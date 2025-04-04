import Hawk from './Hawk/Bundle.Hawk';

$(document).ready(function() {
    var App = {
        Blocks: {},
        Examples: {},
        Routes: {
            WIDGETS_DROPDOWN: "widgets/dropdown/?$",
            WIDGETS_LAYERED_SECTION: "widgets/layered-section/?$",
            MORE_CONTENT_MANAGER: "widgets/more-content-manager/?$"
        },
        Widgets: {
            Overlayers: {},
            Dropdowns: {},
            MoreContentManagers: {},
            DetailsLists: {},
            SlidingLayerManagers: {},
            FormSenders: {}
        }
    };

    // It's good to keep only necessary initialization and assign them to App.Widgets[AppropriateType]
    var HawkExamples = {};

    if (Hawk.Routes.is(App.Routes.WIDGETS_DROPDOWN)) {
        HawkExamples.exemplaryDropdown = new Hawk.Dropdown($('#exemplary-dropdown'));
        HawkExamples.exemplaryDropdown.run();
        //console.log(HawkExamples.exemplaryDropdown.selectByValue(2));

        HawkExamples.expandingDropdown = new Hawk.Dropdown($('#expanding-dropdown'), {
            type: Hawk.DropdownType.EXPANDING
        });
        HawkExamples.expandingDropdown.run();
    } else if (Hawk.Routes.is(App.Routes.WIDGETS_LAYERED_SECTION)) {
        HawkExamples.layeredSection = new Hawk.LayeredSection($('#exemplary-layered-section'));
        HawkExamples.layeredSection.run();
    } else if (Hawk.Routes.is(App.Routes.MORE_CONTENT_MANAGER)) {
        HawkExamples.moreContentManager = new Hawk.MoreContentManager(1, {});
        HawkExamples.moreContentManager.run();
    }


    HawkExamples.detailsList = new Hawk.DetailsList($('#exemplary-details-list'), {});
    HawkExamples.detailsList.run();

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


    HawkVariables.ajaxLoadingItemsManager = new Hawk.AjaxLoadingItemsManager($("#exemplary-ajax-loading-items-manager"), {
        itemsPerLoading: 3
    });
    HawkVariables.ajaxLoadingItemsManager.run();
    HawkVariables.ajaxLoadingItemsManager.load(0);

    HawkVariables.ajaxLoadingItemsManager.container.find('.hawk-ajax-loading-items-manager__clear-button').click(function() {
        HawkVariables.ajaxLoadingItemsManager.clear();
    });

    HawkExamples.StaticFormSender = new Hawk.StaticFormSender($('#exemplary-static-form'), [
        new Hawk.TextFormField("chess-figure-name", {
            validate: Hawk.Validator.isNotEmpty
        })
    ], (formSender) => {
        const validationResult = formSender.validate();

        if (validationResult.length == 0) {
            const field = formSender.getField('chess-figure-name');
            const value = field.getValue().toLowerCase();
            const chessFigures = [
                'knight', 'queen', 'king', 'bishop', 'tower',
                'skoczek', 'koń', 'hetman', 'król', 'goniec', 'laufer', 'wieża'
            ];

            if (chessFigures.indexOf(value) > -1) {
                formSender.options.onCorrect({
                    message: "Ok, great!"
                });
            } else {
                formSender.options.onError({
                    message: "Cannot you play chess, really?"
                });
            }
        } else {
            formSender.changeMessage("Please fill the fields correctly.");
        }

        formSender.finishWorking();
    });
    HawkExamples.StaticFormSender.run();

    HawkExamples.AjaxFormSender = new Hawk.AjaxFormSender($('#exemplary-ajax-form'), [
        new Hawk.TextFormField("name", {
            validate: Hawk.Validator.isNotEmpty
        })
    ], "/ajax/chess-figure");
    HawkExamples.AjaxFormSender.run();
    // blabla

    App.Blocks.ajaxRequestContainer = {
        result: $('#exemplary-ajax-request-manager .simple-ajax-request-container__result'),
        button: $('#exemplary-ajax-request-manager .simple-ajax-request-container__button')
    };

    App.Examples.ajaxRequestManager = new Hawk.AjaxRequestManager({
        // options and callbacks
    });

    App.Blocks.ajaxRequestContainer.button.click(function(e) {
        e.preventDefault();

        App.Examples.ajaxRequestManager.get("/ajax/draw-a-colour", {
            onSuccess: function(result) {
                App.Blocks.ajaxRequestContainer.result.html(result.colour);
            },
            onError: function() {
                App.Blocks.ajaxRequestContainer.result.html("");
            },
            onException: function() {
                App.Blocks.ajaxRequestContainer.result.html("");
            }
        });
    });

    App.Examples.AjaxOverlayerManager = new Hawk.AjaxOverlayerManager($('#overlayer'), {
        // options and callbacks
    });
    App.Examples.AjaxOverlayerManager.run();

    App.Examples.SimpleOverlayerManager = new Hawk.SimpleOverlayerManager($('#overlayer'), {
        // options and callbacks
    });
    App.Examples.SimpleOverlayerManager.run();

    App.Examples.ItemsManager = new Hawk.ItemsManager($('#exemplary-items-manager'), {

    });
    App.Examples.ItemsManager.run();

    // App.Examples.Pager = new Hawk.Pager($('#exemplary-pager'), {
    //     onClick: (pager, nr) => {
    //         console.log(nr);
    //         pager.updatePage(nr);
    //     }
    // });
    // App.Examples.Pager.run(10);
    //
    // App.Examples.AjaxItemsManager = new Hawk.AjaxItemsManager($('#exemplary-ajax-items-manager'), {
    //
    // });
    //
    // App.Examples.AjaxItemsManagerPager = new Hawk.Pager($('#exemplary-ajax-items-manager .hawk-pager'), {
    //     onPageChanged: (pager, nr) => {
    //         console.log(nr);
    //
    //         App.Examples.AjaxItemsManager.load(nr);
    //     }
    // });
    // App.Examples.AjaxItemsManagerPager.run();
    //
    // App.Examples.AjaxItemsManager.addPager(App.Examples.AjaxItemsManagerPager);
    //
    // App.Examples.AjaxItemsManager.run(1);

    Hawk.Launchers.DetailsList($('.presentation-details-list'), {
        slideSpeed: 500,
        autoHide: false,
        onShow: (detailsList, header, contentContainer) => {
            header.find('.icon-arrow').addClass('icon-arrow--north').removeClass('icon-arrow--south');
        },
        onHide: (detailsList, header, contentContainer) => {
            header.find('.icon-arrow').addClass('icon-arrow--south').removeClass('icon-arrow--north');
        }
    });


    setTimeout(function() {
        HawkExamples.anchorsManager = new Hawk.AnchorsManager();
        HawkExamples.anchorsManager.run();
    }, 1000);
    

    // App.Examples.RevealingItem = new Hawk.RevealingItem($('#exemplary-revealing-item'));
    // App.Examples.RevealingItem.run();

    // End of examples

});
