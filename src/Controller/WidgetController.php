<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class WidgetController extends BaseController
{
    /**
     * @Route("/widgets/dropdown")
     */
    public function dropdown() {
        return $this->render('pages/widgets/dropdown.html', [
            'Page' => [
                'title' => static::getTitle("Dropdown"),
                'breadcrumbs' => [
                    [
                        'name' => "Home",
                        'link' => "/"
                    ],
                    [
                        'name' => "Widgets"
                    ],
                    [
                        'name' => "Dropdown"
                    ]
                ]
            ],

            'dropdown' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/widgets/dropdown/hawk-dropdown.html", [
                        'dropdown' => [
                            'id' => "exemplary-dropdown",
                            'title' => "Exemplary dropdown"
                        ],
                        'autoescapeFalse' => false
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/widgets/dropdown/hawk-dropdown.js", [
                    ]), true)
                ],

                'properties' => [
                    [
                        'name' => "slideSpeed",
                        'type' => "integer",
                        'default' => 200,
                        'description' => "Speed of expanding the dropdown (in miliseconds)"
                    ],

                    [
                        'name' => "type",
                        'type' => "DropdownType",
                        'default' => "OVERLAYER",
                        'description' => "Working type."
                    ],

                    [
                        'name' => "direction",
                        'type' => "DropdownDirection",
                        'default' => "DOWNWARDS",
                        'description' => "Opening direction kind."
                    ],

                    [
                        'name' => "containerClass",
                        'type' => "string",
                        'default' => "hawk-dropdown",
                        'description' => "-"
                    ],

                    [
                        'name' => "expandingTypeClass",
                        'type' => "string",
                        'default' => "hawk-dropdown--expanding",
                        'description' => "-"
                    ],

                    [
                        'name' => "upwardsDirectionClass",
                        'type' => "string",
                        'default' => "hawk-dropdown--upwards",
                        'description' => "-"
                    ],

                    [
                        'name' => "openClass",
                        'type' => "string",
                        'default' => "hawk-dropdown--open",
                        'description' => "-"
                    ],

                    [
                        'name' => "headerClass",
                        'type' => "string",
                        'default' => "hawk-dropdown__header",
                        'description' => "-"
                    ],

                    [
                        'name' => "titleClass",
                        'type' => "string",
                        'default' => "hawk-dropdown__title",
                        'description' => "Class name of the element where selected value is displayed."
                    ],

                    [
                        'name' => "listClass",
                        'type' => "string",
                        'default' => "hawk-dropdown__list",
                        'description' => "-"
                    ],

                    [
                        'name' => "listContainerClass",
                        'type' => "string",
                        'default' => "hawk-dropdown__list-container",
                        'description' => "-"
                    ],

                    [
                        'name' => "searchingFieldClass",
                        'type' => "string",
                        'default' => "hawk-dropdown__searching-field",
                        'description' => "-"
                    ],

                    [
                        'name' => "disabledClass",
                        'type' => "string",
                        'default' => "disabled",
                        'description' => "Class which is set up when dropdown becomes disabled."
                    ]
                ],

                'callbacks' => [
                    [
                        'name' => "onShow",
                        'description' => "Is being executed immediately after the dropdown's list is shown.",
                        'parameters' => [
                            [
                                'name' => "dropdown",
                                'type' => "Hawk.Dropdown",
                                'description' => "Current dropdown instance"
                            ]
                        ]
                    ],

                    [
                        'name' => "onShowing",
                        'description' => "Is being executed when the dropdown's list starts to be shown.",
                        'parameters' => [
                            [
                                'name' => "dropdown",
                                'type' => "Hawk.Dropdown",
                                'description' => "Current dropdown instance"
                            ]
                        ]
                    ],

                    [
                        'name' => "onHide",
                        'description' => "Is being executed immediately after the dropdown's list is hidden.",
                        'parameters' => [
                            [
                                'name' => "dropdown",
                                'type' => "Hawk.Dropdown",
                                'description' => "Current dropdown instance"
                            ]
                        ]
                    ],

                    [
                        'name' => "onHiding",
                        'description' => "Is being executed when the dropdown's list starts to be hidden.",
                        'parameters' => [
                            [
                                'name' => "dropdown",
                                'type' => "Hawk.Dropdown",
                                'description' => "Current dropdown instance"
                            ]
                        ]
                    ],

                    [
                        'name' => "onSelected",
                        'description' => "Is being executed immediately after one of the options is selected. The function should return boolean value informing if the operation succeeded.",
                        'type' => "Boolean",
                        'parameters' => [
                            [
                                'name' => "dropdown",
                                'type' => "Hawk.Dropdown",
                                'description' => "Current dropdown instance"
                            ],
                            [
                                'name' => "radio",
                                'type' => "DOM.Input",
                                'description' => "Selected field"
                            ],
                            [
                                'name' => "silently",
                                'type' => "true",
                                'description' => "Additional information for callback function if some actions should be done or just the field should be chosen."
                            ]
                        ]
                    ]
                ],

                'methods' => [
                    [
                        'name' => "show",
                        'type' => "Hawk.Dropdown",
                        'description' => "Opens the dropdown.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "hide",
                        'type' => "Hawk.Dropdown",
                        'description' => "Closes the dropdown.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "isOpen",
                        'type' => "boolean",
                        'description' => "Informs if the dropdown is open or not.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "run",
                        'type' => "Hawk.Dropdown",
                        'description' => "Launches the dropdown and  binds the DOM elements with necessary events.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "select",
                        'type' => "boolean",
                        'description' => "Selects the option precisely by the field. Returns <code class=\"inline-code\">true</code> if the option exists and has been sucessfully chosen, <code class=\"inline-code\">false</code> otherwise.",
                        'parameters' => [
                            [
                                'name' => "field",
                                'type' => "jQuery object",
                                'default' => "-",
                                'description' => "Field that should be selected."
                            ],
                            [
                                'name' => "silently",
                                'type' => "boolean",
                                'default' => "-",
                                'description' => "Extra info that will be passed to the callback function."
                            ]
                        ]
                    ],
                    [
                        'name' => "selectByIndex",
                        'type' => "boolean",
                        'description' => "Selects the option by the position on the list. 0 is the first index. Returns <code class=\"inline-code\">true</code> if the option exists and has been sucessfully chosen, <code class=\"inline-code\">false</code> otherwise.",
                        'parameters' => [
                            [
                                'name' => "index",
                                'type' => "integer",
                                'default' => "-",
                                'description' => "Index of the field that should be selected counted from 0."
                            ],
                            [
                                'name' => "silently",
                                'type' => "boolean",
                                'default' => "-",
                                'description' => "Extra info that will be passed to the callback function."
                            ]
                        ]
                    ],
                    [
                        'name' => "selectByValue",
                        'type' => "boolean",
                        'description' => "Selects the option by the value of the field. Returns <code class=\"inline-code\">true</code> if the option exists and has been sucessfully chosen, <code class=\"inline-code\">false</code> otherwise.",
                        'parameters' => [
                            [
                                'name' => "value",
                                'type' => "string",
                                'default' => "-",
                                'description' => "Value of the field that should be selected."
                            ],
                            [
                                'name' => "silently",
                                'type' => "boolean",
                                'default' => "-",
                                'description' => "Extra info that will be passed to the callback function."
                            ]
                        ]
                    ],
                    [
                        'name' => "isDisabled",
                        'type' => "boolean",
                        'description' => "Informs if the dropdown is disabled.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "disable",
                        'type' => "Hawk.Dropdown",
                        'description' => "Disables the dropdown.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "enable",
                        'type' => "Hawk.Dropdown",
                        'description' => "Enables the dropdown.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "clearFields",
                        'type' => "Hawk.Dropdown",
                        'description' => "Clears all fields and makes them unchecked.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "refreshDependencies",
                        'type' => "Hawk.Dropdown",
                        'description' => "Binds callbacks with the fields.",
                        'parameters' => [

                        ]
                    ]
                ]
            ]
        ]);
    }

    /**
     * @Route("/widgets/layered-section")
     */
    public function layeredSection() {
        return $this->render('pages/widgets/layered-section.html', [
            'Page' => [
                'title' => static::getTitle("Layered section"),
                'breadcrumbs' => [
                    [
                        'name' => "Home",
                        'link' => "/"
                    ],
                    [
                        'name' => "Widgets"
                    ],
                    [
                        'name' => "Layered section"
                    ]
                ]
            ],

            'layeredSection' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/widgets/layered-section/hawk-layered-section.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/widgets/layered-section/hawk-layered-section.js", [
                    ]), true)
                ],

                'properties' => [
                    [
                        'name' => "containerClass",
                        'type' => "string",
                        'default' => "hawk-layered-section",
                        'description' => "-"
                    ],
                    [
                        'name' => "baseLayerClass",
                        'type' => "string",
                        'default' => "hawk-layered-section__base-layer",
                        'description' => "-"
                    ],
                    [
                        'name' => "baseLayerInnerClass",
                        'type' => "string",
                        'default' => "hawk-layered-section__base-layer-inner",
                        'description' => "-"
                    ],
                    [
                        'name' => "aboveLayerClass",
                        'type' => "string",
                        'default' => "hawk-layered-section__above-layer",
                        'description' => "-"
                    ],
                    [
                        'name' => "aboveLayerInnerClass",
                        'type' => "string",
                        'default' => "hawk-layered-section__above-layer-inner",
                        'description' => "-"
                    ],
                    [
                        'name' => "buttonClass",
                        'type' => "string",
                        'default' => "hawk-layered-section__button",
                        'description' => "-"
                    ],

                    [
                        'name' => "nameAttribute",
                        'type' => "string",
                        'default' => "data-name",
                        'description' => "Layer-pointing attribute's name."
                    ],

                    [
                        'name' => "baseLayerName",
                        'type' => "string",
                        'default' => "base",
                        'description' => "Name of the base layer."
                    ]
                ],

                'callbacks' => [
                    [
                        'name' => "onAboveLayerShow",
                        'description' => "Is being executed immediately after the layer is shown.",
                        'parameters' => [
                            [
                                'name' => "layeredSection",
                                'type' => "Hawk.LayeredSection",
                                'description' => "current Layered Section instance"
                            ],
                            [
                                'name' => "aboveLayer",
                                'type' => "jQuery object",
                                'description' => "current layer"
                            ]
                        ]
                    ]
                ],

                'methods' => [
                    [
                        'name' => "showBaseLayer",
                        'type' => "Hawk.LayeredSection",
                        'description' => "Shows the base layer.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "hideBaseLayer",
                        'type' => "Hawk.LayeredSection",
                        'description' => "Hides the base layer.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "hideLayers",
                        'type' => "Hawk.LayeredSection",
                        'description' => "Hides all the layers.",
                        'parameters' => [

                        ]
                    ],
                    [
                        'name' => "showLayer",
                        'type' => "boolean",
                        'description' => "Shows the indicated layer. Returns <code class=\"inline-code\">true</code> when the layer exists and may be shown or <code class=\"inline-code\">false</code> otherwise.",
                        'parameters' => [
                            [
                                'name' => "name",
                                'type' => "string",
                                'description' => "Layer's name."
                            ]
                        ]
                    ],
                    [
                        'name' => "run",
                        'type' => "Hawk.LayeredSection",
                        'description' => "Launches the Layered Section and binds the DOM elements with&nbsp;necessary events.",
                        'parameters' => [

                        ]
                    ]
                ]
            ]
        ]);
    }

    /**
     * @Route("/widgets/more-content-manager")
     */
    public function moreContentManager() {
        return $this->render('pages/widgets/more-content-manager.html', [
            'Page' => [
                'title' => static::getTitle("More content manager"),
                'breadcrumbs' => [
                    [
                        'name' => "Home",
                        'link' => "/"
                    ],
                    [
                        'name' => "Widgets"
                    ],
                    [
                        'name' => "More content manager"
                    ]
                ]
            ],

            'moreContentManager' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/widgets/more-content-manager/hawk-more-content-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/widgets/more-content-manager/hawk-more-content-manager.js", [
                    ]), true)
                ],

                'properties' => [
                    [
                        'name' => "buttonClass",
                        'type' => "string",
                        'default' => "hawk-more-content-button",
                        'description' => "Classname of the button which works with the hidable content."
                    ],

                    [
                        'name' => "buttonContentClass",
                        'type' => "string",
                        'default' => "hawk-more-content-button__content",
                        'description' => "Classname of the button's element where the text should be changed after the content is toggled."
                    ],

                    [
                        'name' => "contentClass",
                        'type' => "string",
                        'default' => "hawk-more-content",
                        'description' => "Classname of the content which is being toggled by clicking the button."
                    ],

                    [
                        'name' => "IDAttrName",
                        'type' => "string",
                        'default' => "data-id",
                        'description' => "Name of the binding button with content attribute. "
                    ],

                    [
                        'name' => "managerIDAttrName",
                        'type' => "string",
                        'default' => "data-more-content-manager",
                        'description' => "Name of the attribute that indicates the Hawk.MoreContentManager instance which should handle the action. Binded to the button."
                    ],

                    [
                        'name' => "buttonOppositeTextAttr",
                        'type' => "string",
                        'default' => "data-opposite-text",
                        'description' => "Name of the attribute which contains the text that is placed in the button when the content is shown."
                    ],

                    [
                        'name' => "eventName",
                        'type' => "string",
                        'default' => "click.moreContent",
                        'description' => "Name of the button click event."
                    ]
                ],
                'callbacks' => [
                    [
                        'name' => "actionShow",
                        'description' => "Makes the content visible. Velocity's <span class=\"inline-code\">slideDown</span> by default.",
                        'parameters' => [
                            [
                                'name' => "content",
                                'type' => "jQuery object",
                                'description' => "current content to display"
                            ]
                        ]
                    ],
                    [
                        'name' => "actionHide",
                        'description' => "Makes the content hidden. Velocity's <span class=\"inline-code\">slideUp</span> by default.",
                        'parameters' => [
                            [
                                'name' => "content",
                                'type' => "jQuery object",
                                'description' => "current content to disappear"
                            ]
                        ]
                    ],
                    [
                        'name' => "onShow",
                        'description' => "Is being executed immediately when the content starts to show. Changes the button's text to the one from <span class=\"inline-code\">buttonOppositeTextAttr</span> attribute by default.",
                        'parameters' => [
                            [
                                'name' => "mcm",
                                'type' => "Hawk.MoreContentManager",
                                'description' => "current manager instance"
                            ],
                            [
                                'name' => "button",
                                'type' => "jQuery object",
                                'description' => "-"
                            ],
                            [
                                'name' => "content",
                                'type' => "jQuery object",
                                'description' => "-"
                            ]
                        ]
                    ],

                    [
                        'name' => "onHide",
                        'description' => "Is being executed immediately when the content starts to hide. Changes the button's text to the initial value by default.",
                        'parameters' => [
                            [
                                'name' => "mcm",
                                'type' => "Hawk.MoreContentManager",
                                'description' => "current manager instance"
                            ],
                            [
                                'name' => "button",
                                'type' => "jQuery object",
                                'description' => "-"
                            ],
                            [
                                'name' => "content",
                                'type' => "jQuery object",
                                'description' => "-"
                            ]
                        ]
                    ]
                ],
                'methods' => []
            ]
        ]);
    }

    /**
     * @Route("/widgets/ajax-overlayer-manager")
     */
    public function ajaxOverlayerManager() {
        return $this->render('pages/widgets/ajax-overlayer-manager.html', [
            'Page' => [
                'title' => static::getTitle("AJAX Overlayer Manager"),
                'breadcrumbs' => [
                    [
                        'name' => "Home",
                        'link' => "/"
                    ],
                    [
                        'name' => "Widgets"
                    ],
                    [
                        'name' => "AJAX Overlayer Manager"
                    ]
                ]
            ],

            'ajaxOverlayerManager' => static::getOverlayerManagerDoc([
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/widgets/ajax-overlayer-manager/hawk-ajax-overlayer-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/widgets/ajax-overlayer-manager/hawk-ajax-overlayer-manager.js", [
                    ]), true)
                ],

                'request' => [
                    [
                        'name' => "id",
                        'type' => "string",
                        'description' => "The ID of the content that is going to be loaded."
                    ],
                    [
                        'name' => "bundle",
                        'type' => "array",
                        'description' => "A bundle of extra values that can be required to load the&nbsp;appropriate content."
                    ],
                    [
                        'name' => "lang",
                        'type' => "string",
                        'description' => "The language code that is taken from the <code class=\"inline-code\">lang</code> attribute of <code class=\"inline-code\">html</code> element."
                    ]
                ],

                'response' => [
                    [
                        'name' => "status",
                        'type' => "Hawk.RequestStatus (integer)",
                        'description' => "The status of the proceeded response. <a href=\"#ajax-communication\">See more</a>"
                    ],
                    [
                        'name' => "html",
                        'type' => "string",
                        'description' => "The HTML content that should be displayed on the overlayer."
                    ],
                    [
                        'name' => "id",
                        'type' => "string",
                        'description' => "The ID of the content that is loaded (should be the same as in the Request)."
                    ]
                ],

                'properties' => [
                    [
                        'name' => "path",
                        'type' => "string",
                        'default' => "/ajax/load-overlayer",
                        'description' => "Path to the endpoint which processes the Request and returns a JSON Response with the content that is going to be shown on the layer. The Request and Response structure is described below."
                    ],

                    [
                        'name' => "buttonClass",
                        'type' => "string",
                        'default' => "ajax-overlayer-button",
                        'description' => "The class' name of the elements which open the overlayer. They are described wider above."
                    ]
                ]
            ])
        ]);
    }

    /**
     * @Route("/widgets/simple-overlayer-manager")
     */
    public function simpleOverlayerManager() {
        return $this->render('pages/widgets/simple-overlayer-manager.html', [
            'Page' => [
                'title' => static::getTitle("Simple Overlayer Manager"),
                'breadcrumbs' => [
                    [
                        'name' => "Home",
                        'link' => "/"
                    ],
                    [
                        'name' => "Widgets"
                    ],
                    [
                        'name' => "Simple Overlayer Manager"
                    ]
                ]
            ],

            'simpleOverlayerManager' => static::getOverlayerManagerDoc([
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/widgets/overlayers/hawk-simple-overlayer-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/widgets/overlayers/hawk-simple-overlayer-manager.js", [
                    ]), true)
                ],

                'properties' => [
                    [
                        'name' => "buttonClass",
                        'type' => "string",
                        'default' => "simple-overlayer-button",
                        'description' => "The class' name of the elements which open the overlayer. They are described wider above."
                    ],

                    [
                        'name' => "contentToLoadClass",
                        'type' => "string",
                        'default' => "simple-overlayer-content",
                        'description' => "The class' name of the elements which contain contents for SimpleOverlayerManager. They are described wider above."
                    ]
                ]
            ])
        ]);
    }

    /**
     * @Route("/widgets/details-list")
     */
    public function detailsList() {
        return $this->render('pages/widgets/details-list.html', [
            'Page' => [
                'title' => static::getTitle("Details List"),
                'breadcrumbs' => [
                    [
                        'name' => "Home",
                        'link' => "/"
                    ],
                    [
                        'name' => "Widgets"
                    ],
                    [
                        'name' => "Details List"
                    ]
                ]
            ],

            'detailsList' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/widgets/details-list/details-list.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/widgets/details-list/details-list.js", [
                    ]), true)
                ],

                'properties' => [
                    [
                        'name' => "autoHide",
                        'type' => "boolean",
                        'default' => "true",
                        'description' => "Indicates whether to hide all the currently displayed contents when the new one is going to be visible."
                    ]
                ],
                'callbacks' => [
                    [
                        'name' => "onShow",
                        'description' => "It is invoked when the content is going to be displayed.",
                        'parameters' => [
                            [
                                'name' => "detailsList",
                                'type' => "Hawk.DetailsList",
                                'description' => "Current instance of Hawk.DetailsList"
                            ],
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Header</span> element."
                            ],
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Content Container</span> element."
                            ]
                        ]
                    ],
                    [
                        'name' => "onHide",
                        'description' => "It is invoked when the content is going to be hidden.",
                        'parameters' => [
                            [
                                'name' => "detailsList",
                                'type' => "Hawk.DetailsList",
                                'description' => "Current instance of Hawk.DetailsList"
                            ],
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Header</span> element."
                            ],
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Content Container</span> element."
                            ]
                        ]
                    ]
                ],
                'methods' => [
                    [
                        'name' => "show",
                        'type' => "void",
                        'description' => "Shows the content.",
                        'parameters' => [
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'default' => "-",
                                'description' => "The header which the content is related with."
                            ]
                        ]
                    ],
                    [
                        'name' => "hide",
                        'type' => "void",
                        'description' => "Hides the content.",
                        'parameters' => [
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'default' => "-",
                                'description' => "The header which the content is related with."
                            ]
                        ]
                    ]
                ]
            ]
        ]);
    }

    /**
     * @Route("/widgets/items-manager")
     */
    public function itemsManager() {
        return $this->render('pages/widgets/items-manager.html', [
            'Page' => [
                'title' => static::getTitle("Items manager"),
                'breadcrumbs' => [
                    [
                        'name' => "Home",
                        'link' => "/"
                    ],
                    [
                        'name' => "Widgets"
                    ],
                    [
                        'name' => "Items manager"
                    ]
                ]
            ],

            'itemsManager' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/widgets/items-manager/items-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/widgets/items-manager/items-manager.js", [
                    ]), true)
                ],

              /*  'properties' => [
                    [
                        'name' => "autoHide",
                        'type' => "boolean",
                        'default' => "true",
                        'description' => "Indicates whether to hide all the currently displayed contents when the new one is going to be visible."
                    ]
                ],
                'callbacks' => [
                    [
                        'name' => "onShow",
                        'description' => "It is invoked when the content is going to be displayed.",
                        'parameters' => [
                            [
                                'name' => "detailsList",
                                'type' => "Hawk.DetailsList",
                                'description' => "Current instance of Hawk.DetailsList"
                            ],
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Header</span> element."
                            ],
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Content Container</span> element."
                            ]
                        ]
                    ],
                    [
                        'name' => "onHide",
                        'description' => "It is invoked when the content is going to be hidden.",
                        'parameters' => [
                            [
                                'name' => "detailsList",
                                'type' => "Hawk.DetailsList",
                                'description' => "Current instance of Hawk.DetailsList"
                            ],
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Header</span> element."
                            ],
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "Current <span class=\"inline-code\">Content Container</span> element."
                            ]
                        ]
                    ]
                ],
                'methods' => [
                    [
                        'name' => "show",
                        'type' => "void",
                        'description' => "Shows the content.",
                        'parameters' => [
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'default' => "-",
                                'description' => "The header which the content is related with."
                            ]
                        ]
                    ],
                    [
                        'name' => "hide",
                        'type' => "void",
                        'description' => "Hides the content.",
                        'parameters' => [
                            [
                                'name' => "header",
                                'type' => "jQuery object",
                                'default' => "-",
                                'description' => "The header which the content is related with."
                            ]
                        ]
                    ]
                ] */
            ]
        ]);
    }

    static public function getOverlayerManagerDoc(array $extraValues = []) : array {
        return array_merge_recursive($extraValues, [
            'properties' => [
                [
                    'name' => "mode",
                    'type' => "Hawk.AjaxOverlayerManagerConstants.Modes",
                    'default' => "DEFAULT",
                    'description' => "Click event assignment mode."
                ],

                [
                    'name' => "fadeSpeed",
                    'type' => "integer",
                    'default' => 200,
                    'description' => "The speed of the overlayer's appearing and disappearing (in miliseconds)."
                ],

                [
                    'name' => "slideSpeed",
                    'type' => "integer",
                    'default' => 200,
                    'description' => "The speed of expanding the content on the layer (in miliseconds)."
                ],

                [
                    'name' => "closeOnClickOutside",
                    'type' => "boolean",
                    'default' => "false",
                    'description' => "Whether to close the overlayer when user clicks outside the content's container or not."
                ],

                [
                    'name' => "eventName",
                    'type' => "string",
                    'default' => "click.overlayerManager",
                    'description' => "A name of the JavaScript <span class=\"code\">click</span> event that the <span class=\"code\">Hawk.AjaxOverlayerManager</span> instance should use to control buttons connected with this instance."
                ],

                [
                    'name' => "popstateEventName",
                    'type' => "string",
                    'default' => "popstate.overlayerManager",
                    'description' => "A name of the JavaScript <span class=\"code\">popstate</span> event that the <span class=\"code\">Hawk.AjaxOverlayerManager</span> instance should use to control the browser's back button."
                ],

                [
                    'name' => "wrapperClass",
                    'type' => "string",
                    'default' => "overlayer__wrapper",
                    'description' => "The class' name of the wrapper."
                ],

                [
                    'name' => "contentContainerClass",
                    'type' => "string",
                    'default' => "overlayer__content-container",
                    'description' => "The class' name of the content's container."
                ],

                [
                    'name' => "contentClass",
                    'type' => "string",
                    'default' => "overlayer__content",
                    'description' => "The class' name of the content element."
                ],
                [
                    'name' => "loadingLayerClass",
                    'type' => "string",
                    'default' => "overlayer__loading-layer",
                    'description' => "The class' name of the layer which is visible when the content is loading."
                ],

                [
                    'name' => "closeButtonClass",
                    'type' => "string",
                    'default' => "ajax-overlayer-close",
                    'description' => "The class' name of the element which closes the overlayer. This element needs to be inside the overlayer container (may be in the loaded part, though)."
                ],

                [
                    'name' => "baseZIndexValue",
                    'type' => "integer",
                    'default' => 9000,
                    'description' => "Base value of z-index feature that is being increased and being set for following instances of Hawk.AjaxOverlayerManager."
                ]
            ],
            'callbacks' => [
                [
                    'name' => "onLoad",
                    'description' => "It is invoked when the content has been loaded.",
                    'parameters' => [
                        [
                            'name' => "ajaxOverlayerManager",
                            'type' => "Hawk.AjaxOverlayerManager",
                            'description' => "Current instance of Hawk.AjaxOverlayerManager"
                        ],
                        [
                            'name' => "id",
                            'type' => "string",
                            'description' => "ID of the loaded content."
                        ],
                        [
                            'name' => "result",
                            'type' => "object",
                            'description' => "The whole result object returned by the server."
                        ]
                    ]
                ],

                [
                    'name' => "onLoading",
                    'description' => "It is invoked when the AJAX request is completed and the content is going to be changed.",
                    'parameters' => [
                        [
                            'name' => "ajaxOverlayerManager",
                            'type' => "Hawk.AjaxOverlayerManager",
                            'description' => "Current instance of Hawk.AjaxOverlayerManager"
                        ],
                        [
                            'name' => "id",
                            'type' => "string",
                            'description' => "ID of the loaded content."
                        ],
                        [
                            'name' => "result",
                            'type' => "object",
                            'description' => "The whole result object returned by the server."
                        ]
                    ]
                ],

                [
                    'name' => "onShow",
                    'description' => "It is invoked when the overlayer is being shown.",
                    'parameters' => [
                        [
                            'name' => "ajaxOverlayerManager",
                            'type' => "Hawk.AjaxOverlayerManager",
                            'description' => "Current instance of Hawk.AjaxOverlayerManager"
                        ]
                    ]
                ],

                [
                    'name' => "onHide",
                    'description' => "It is invoked when the overlayer is being hidden.",
                    'parameters' => [
                        [
                            'name' => "ajaxOverlayerManager",
                            'type' => "Hawk.AjaxOverlayerManager",
                            'description' => "Current instance of Hawk.AjaxOverlayerManager"
                        ]
                    ]
                ],

                [
                    'name' => "onInitialize",
                    'description' => "It is invoked when the page has been loaded and the overlayer has already been initialized. It should process the hash and possibly load the appropriate content.",
                    'parameters' => [
                        [
                            'name' => "ajaxOverlayerManager",
                            'type' => "Hawk.AjaxOverlayerManager",
                            'description' => "Current instance of Hawk.AjaxOverlayerManager"
                        ],
                        [
                            'name' => "hash",
                            'type' => "string",
                            'description' => "The value of the <span class=\"code\">window.location.hash</span>"
                        ]
                    ]
                ],

                [
                    'name' => "changeContent",
                    'description' => "It is invoked when the content is going to be put in the overlayer.",
                    'parameters' => [
                        [
                            'name' => "ajaxOverlayerManager",
                            'type' => "Hawk.AjaxOverlayerManager",
                            'description' => "Current instance of Hawk.AjaxOverlayerManager"
                        ],
                        [
                            'name' => "content",
                            'type' => "jQuery object",
                            'description' => "-"
                        ],
                        [
                            'name' => "callback",
                            'type' => "function",
                            'description' => "The function that should be invoked when content is placed in the overlayer"
                        ]
                    ]
                ],

                [
                    'name' => "hide",
                    'description' => "This function hides the overlayer.",
                    'parameters' => [
                        [
                            'name' => "ajaxOverlayerManager",
                            'type' => "Hawk.AjaxOverlayerManager",
                            'description' => "Current instance of Hawk.AjaxOverlayerManager"
                        ]
                    ]
                ]
            ],
            'methods' => [
                [
                    'name' => "getOverlayerID",
                    'type' => "integer",
                    'description' => "Returns the overlayer's id number.",
                    'parameters' => [

                    ]
                ],
                [
                    'name' => "getLang",
                    'type' => "string",
                    'description' => "Returns the language code which is inferred from the <code class=\"inline-code\">lang</code> attribute of the <code class=\"inline-code\">html</code> element.",
                    'parameters' => [

                    ]
                ],

                [
                    'name' => "hide",
                    'type' => "void",
                    'description' => "Closes the overlayer.",
                    'parameters' => [

                    ]
                ],
                [
                    'name' => "show",
                    'type' => "void",
                    'description' => "Shows the overlayer.",
                    'parameters' => [

                    ]
                ],

                [
                    'name' => "load",
                    'type' => "void",
                    'description' => "Loads the content. Sends the Request to the endpoint defined in the options and shows the overlayer with the already loaded content.",
                    'parameters' => [
                        [
                            'name' => "id",
                            'type' => "string",
                            'default' => "-",
                            'description' => "The ID of the content that should be loaded (sent with the Request). Helps the server to return the appropriate result."
                        ],
                        [
                            'name' => "bundle",
                            'type' => "object",
                            'default' => "{}",
                            'description' => "The extra parameters that can be used by the backend service."
                        ]
                    ]
                ],
                [
                    'name' => "changeContent",
                    'type' => "void",
                    'description' => "Changes the content inside the overlayer.",
                    'parameters' => [
                        [
                            'name' => "content",
                            'type' => "string",
                            'default' => "-",
                            'description' => "The string containing the HTML code that is going to be shown in the overlayer."
                        ],
                        [
                            'name' => "callback",
                            'type' => "function",
                            'default' => "null",
                            'description' => "The callback that is being invoked after the content is changed."
                        ]
                    ]
                ],

                [
                    'name' => "run",
                    'type' => "void",
                    'description' => "Launches the Ajax Overlayer Manager and binds the DOM elements with necessary events. ",
                    'parameters' => [
                    ]
                ]
            ]
        ]);
    }
}