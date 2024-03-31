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
    public function dropdown()
    {
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
                    'html' => highlight_string($this->renderView("hawk/modules/dropdown/hawk-dropdown.html", [
                        'dropdown' => [
                            'id' => "exemplary-dropdown",
                            'title' => "Exemplary dropdown"
                        ],
                        'autoescapeFalse' => false
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/dropdown/hawk-dropdown.js", [
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
                        'type' => "Hawk.DropdownConstants.Types",
                        'default' => "OVERLAYER",
                        'description' => "Working type."
                    ],

                    [
                        'name' => "direction",
                        'type' => "Hawk.DropdownConstants.Directions",
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
    public function layeredSection()
    {
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
                    'html' => highlight_string($this->renderView("hawk/modules/layered-section/hawk-layered-section.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/layered-section/hawk-layered-section.js", [
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
    public function moreContentManager()
    {
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
                    'html' => highlight_string($this->renderView("hawk/modules/more-content-manager/hawk-more-content-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/more-content-manager/hawk-more-content-manager.js", [
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
}