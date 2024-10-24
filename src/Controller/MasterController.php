<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MasterController extends BaseController {

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

    /**
     * @Route("/")
     */
    public function index() {
        return $this->render('home.html', [
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
            ],

            'ajaxOverlayerManager' => static::getOverlayerManagerDoc([
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/modules/ajax-overlayer-manager/hawk-ajax-overlayer-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/ajax-overlayer-manager/hawk-ajax-overlayer-manager.js", [
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
                        'description' => "The status of the processed response. <a href=\"#ajax-communication\">See more</a>"
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
            ]),

            'simpleOverlayerManager' => static::getOverlayerManagerDoc([
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/modules/overlayers/hawk-simple-overlayer-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/overlayers/hawk-simple-overlayer-manager.js", [
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
            ]),

            'detailsList' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/modules/details-list/details-list.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/details-list/details-list.js", [
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
            ],

            'ajaxLoadingItemsManager' => [
                'listings' => [
//                    'html' => highlight_string($this->renderView("hawk/modules/details-list/details-list.html", [
//                    ]), true),
//                    'js' => highlight_string($this->renderView("hawk/modules/details-list/details-list.js", [
//                    ]), true)
                ],

                'properties' => [
                    [
                        'name' => "path",
                        'type' => "string",
                        'default' => "/ajax/load-items",
                        'description' => "Path to the endpoint which processes the Request and returns a&nbsp;JSON&nbsp;Response with the items that are going to be shown. The Request and Response structure is described below."
                    ],
                    [
                        'name' => "itemsPerLoading",
                        'type' => "integer",
                        'default' => 6,
                        'description' => "Number of items that should be loaded. It is being sent to the server with the Request."
                    ],
                    [
                        'name' => "itemsDisplayingType",
                        'type' => "string",
                        'default' => "block",
                        'description' => "CSS value of the <code class=\"inline-code\">display</code> feature which should be applied to the loaded items after they are shown."
                    ],
                    [
                        'name' => "bundle",
                        'type' => "function",
                        'default' => "() : {}",
                        'description' => "A function that returns the JS object with extra data that should be sent to the server to prepare appropriate items to return."
                    ],

                    [
                        'name' => "itemClass",
                        'type' => "string",
                        'default' => "hawk-ajax-loading-items-manager__item",
                        'description' => "A classname of loaded items. Necessary if items can be being hidden."
                    ],
                    [
                        'name' => "buttonClass",
                        'type' => "string",
                        'default' => "hawk-ajax-loading-items-manager__button",
                        'description' => "A classname of button which launches the loading."
                    ],
                    [
                        'name' => "contentContainerClass",
                        'type' => "string",
                        'default' => "hawk-ajax-loading-items-manager__content-container",
                        'description' => "A classname of the container where loaded items should be placed in."
                    ],
                    [
                        'name' => "loadingLayerClass",
                        'type' => "string",
                        'default' => "hawk-ajax-loading-items-manager__loading-layer",
                        'description' => "A classname of the node that should be shown during loading."
                    ],

                    [
                        'name' => "slideSpeed",
                        'type' => "integer",
                        'default' => 400,
                        'description' => "The speed of expanding the loading items (in miliseconds)."
                    ],
                    [
                        'name' => "fadeSpeed",
                        'type' => "integer",
                        'default' => 400,
                        'description' => "The speed of appearing and disappearing of the loaded items (in miliseconds)."
                    ]
                ],
                'callbacks' => [
                    [
                        'name' => "appendItems",
                        'description' => "It should append loaded items to container with necessary way.",
                        'parameters' => [
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "Container for items."
                            ],
                            [
                                'name' => "items",
                                'type' => "jQuery object",
                                'description' => "Already loaded items as HTML wrapped in jQuery object."
                            ]
                        ]
                    ],
                    [
                        'name' => "prepareHTML",
                        'description' => "It should prepare jQuery object from loaded data (a raw HTML or a JS objects collection) to pass them to <span class=\"inline-code\">appendItems</span> function.",
                        'parameters' => [
                            [
                                'name' => "rawHTML",
                                'type' => "string",
                                'description' => "Loaded items as raw HTML string"
                            ],
                            [
                                'name' => "items",
                                'type' => "JS objects collection",
                                'description' => "Loaded items as JS objects collection"
                            ]
                        ]
                    ],
                    [
                        'name' => "onLoad",
                        'description' => "It is invoked when items are loaded and placed into content container.",
                        'parameters' => [
                            [
                                'name' => "buttons",
                                'type' => "jQuery object",
                                'description' => "Buttons launching the loading."
                            ],
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "The element where loaded items are placed in."
                            ]
                        ]
                    ],
                    [
                        'name' => "onDone",
                        'description' => "It is invoked when all items are loaded and placed into content container and there's no more to load.",
                        'parameters' => [
                            [
                                'name' => "buttons",
                                'type' => "jQuery object",
                                'description' => "Buttons launching the loading."
                            ],
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "The element where loaded items are placed in."
                            ]
                        ]
                    ],
                    [
                        'name' => "onError",
                        'description' => "It is invoked when there an error occurred during loading.",
                        'parameters' => [
                            [
                                'name' => "buttons",
                                'type' => "jQuery object",
                                'description' => "Buttons launching the loading."
                            ],
                            [
                                'name' => "contentContainer",
                                'type' => "jQuery object",
                                'description' => "The element where loaded items are placed in."
                            ]
                        ]
                    ]
                ],
                'methods' => [
                    [
                        'name' => "isDone",
                        'type' => "bool",
                        'description' => "Informs if loading is completed or not.",
                        'parameters' => [
                        ]
                    ],
                    [
                        'name' => "load",
                        'type' => "void",
                        'description' => "Loads more items by sending a request to the backend.",
                        'parameters' => [
                            [
                                'name' => "offset",
                                'type' => "integer",
                                'default' => "0",
                                'description' => "Number of items which should be skipped."
                            ]
                        ]
                    ],
                    [
                        'name' => "setFilter",
                        'type' => "void",
                        'description' => "Sets a filter, which should be send with next requests.",
                        'parameters' => [
                            [
                                'name' => "offset",
                                'type' => "integer",
                                'default' => "0",
                                'description' => "Number of items which should be skipped."
                            ]
                        ]
                    ]
                ]
            ],

            'slidingLayerManager' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/modules/sliding-layer-manager/hawk-sliding-layer-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/sliding-layer-manager/sliding-layer-manager.js", [
                    ]), true)
                ]
            ],

            'formSender' => [
                'staticFormSender' => [
                    'listings' => [
                        'html' => highlight_string($this->renderView("hawk/modules/more-content-manager/hawk-more-content-manager.html", [
                        ]), true),
                        'js' => highlight_string($this->renderView("hawk/modules/form-sender/static-form-sender.js", [
                        ]), true)
                    ]
                ]
            ],

            'ajaxRequestManager' => [
                'listings' => [
                    'js' => highlight_string($this->renderView("hawk/modules/ajax-request-manager/ajax-request-manager.js", [
                    ]), true)
                ]
            ]
        ]);
    }

    /**
     * @Route("/elements")
     */
    public function elements() {
        return $this->render('elements.html', [
            'listings' => [
                'button' => [
                    'large' => highlight_string($this->renderView("listings/blocks/listing-button.html", [
                        'button' => [
                            'extraClass' => ' button--large',
                            'content' => "Large button"
                        ]
                    ]), true),

                    'regular' => highlight_string($this->renderView("listings/blocks/listing-button.html", [
                        'button' => [
                            'extraClass' => '',
                            'content' => "Button"
                        ]
                    ]), true),

                    'small' => highlight_string($this->renderView("listings/blocks/listing-button.html", [
                        'button' => [
                            'extraClass' => ' button--small',
                            'content' => "Small button"
                        ]
                    ]), true)
                ]
            ]
        ]);
    }

    /**
     * @Route("/icons")
     */
    public function icons() {
        return $this->render('icons.html', [

        ]);
    }

    /**
     * @Route("/variables")
     */
    public function variables() {
        return $this->render('variables.html', [
            'resolutions' => [
                [
                    [
                        'name' => 'mobile-s',
                        'value' => '380'
                    ],
                    [
                        'name' => 'mobile-m',
                        'value' => '420'
                    ],
                    [
                        'name' => 'mobile-l',
                        'value' => '480'
                    ],
                    [
                        'name' => 'mobile-xl',
                        'value' => '550'
                    ]
                ],
                [
                    [
                        'name' => 'tablet-s',
                        'value' => '650'
                    ],
                    [
                        'name' => 'tablet-m',
                        'value' => '768'
                    ],
                    [
                        'name' => 'tablet-l',
                        'value' => '900'
                    ],
                    [
                        'name' => 'tablet-xl',
                        'value' => '992'
                    ]
                ],
                [
                    [
                        'name' => 'desktop-s',
                        'value' => '1100'
                    ],
                    [
                        'name' => 'desktop-m',
                        'value' => '1300'
                    ],
                    [
                        'name' => 'desktop-l',
                        'value' => '1500'
                    ],
                    [
                        'name' => 'desktop-xl',
                        'value' => '1700'
                    ]
                ]
            ],

            'colors' => [
                [
                    [
                        'name' => 'dark-color',
                        'value' => '#000000'
                    ],
                    [
                        'name' => 'dark-color-op80',
                        'value' => 'rgba(0, 0, 0, 0.8)',
                    ],
                    [
                        'name' => 'dark-color-op60',
                        'value' => 'rgba(0, 0, 0, 0.6)',
                    ],
                    [
                        'name' => 'dark-color-op40',
                        'value' => 'rgba(0, 0, 0, 0.4)',
                    ],

                    [
                        'name' => 'dark-color-01',
                        'value' => '#222222'
                    ],
                    [
                        'name' => 'dark-color-02',
                        'value' => '#3D3D3D'
                    ],
                    [
                        'name' => 'dark-color-03',
                        'value' => '#444444'
                    ],
                    [
                        'name' => 'dark-color-04',
                        'value' => '#4B4B4B'
                    ],
                    [
                        'name' => 'dark-color-05',
                        'value' => '#777777'
                    ],

                    [
                        'name' => 'primary-color',
                        'value' => '#F38630'
                    ],
                    [
                        'name' => 'primary-color-01',
                        'value' => '#FA6900'
                    ]
                ],

                [
                    [
                        'name' => 'light-color',
                        'value' => '#FFFFFF',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],
                    [
                        'name' => 'light-color-op80',
                        'value' => 'rgba(255, 255, 255, .8)',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],
                    [
                        'name' => 'light-color-op60',
                        'value' => 'rgba(255, 255, 255, .6)',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],
                    [
                        'name' => 'light-color-op40',
                        'value' => 'rgba(255, 255, 255, .4)',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],

                    [
                        'name' => 'light-color-01',
                        'value' => '#FAFAFA',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],
                    [
                        'name' => 'light-color-02',
                        'value' => '#F5F5F5',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],
                    [
                        'name' => 'light-color-03',
                        'value' => '#EEEEEE',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],
                    [
                        'name' => 'light-color-04',
                        'value' => '#E5E5E5',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],
                    [
                        'name' => 'light-color-05',
                        'value' => '#C4C4C4',
                        'colorSampleExtraClass' => " color-sample--bright"
                    ],

                    [
                        'name' => 'secondary-color',
                        'value' => '#69D2E7'
                    ],
                    [
                        'name' => 'secondary-color-01',
                        'value' => '#23AABA'
                    ]




                    /***
                     * $light-color-op60: rgba($light-color, 0.6);
$light-color-op30: rgba($light-color, 0.3);
$light-color-01: #fafafa;
$light-color-02: #f5f5f5;
$light-color-03: #F5F5F5;
$light-color-04: #E1E1E1;
$light-color-05: #fefdfd;
**/
                ]
            ]
        ]);
    }

    /**
     * @Route("/blocks")
     */
    public function blocks() {
        $headersFiles = [
            '_section-header.scss',
            '_section-subheader.scss',
            '_subsection-header.scss',
            '_subsection-subheader.scss',
            '_simple-header.scss',
            '_plain-header.scss'
        ];

        $headersCode = "";

        foreach ($headersFiles as $file) {
            $headersCode .= file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/headers/' . $file) . "\n";
        }

        $titlesFiles = [
            '_section-title.scss',
            '_section-subtitle.scss',
            '_subsection-title.scss',
            '_subsection-subtitle.scss',
            '_simple-title.scss',
            '_small-title.scss',
            '_text-title.scss'
        ];

        $titlesCode = "";

        foreach ($titlesFiles as $file) {
            $titlesCode .= file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/titles/' . $file) . "\n";
        }

        return $this->render('blocks.html', [
            'blocks' => [
                'html' => [
                    'sectionTitle' => [
                        'regular' => highlight_string($this->renderView("blocks/section-title.html", [
                            'sectionTitle' => [
                                'extraClass' => '',
                                'content' => "Section title"
                            ]
                        ]), true)
                    ],
                    'text' => [
                        'regular' => highlight_string($this->renderView("listings/blocks/listing-text.html", [

                        ]), true)
                    ],
                    'button' => [
                        'regular' => highlight_string($this->renderView("blocks/button.html", [
                            'button' => [
                                'extraClass' => "",
                                'content' => "Button"
                            ]
                        ]), true)
                    ],
                    'tile' => [
                        'clear' => highlight_string($this->renderView("blocks/tile.html", [
                            'tile' => [
                                'type' => "clear",
                                'image' => "/img/pictures/husaria.jpg"
                            ]
                        ]), true),
                        'standard' => highlight_string($this->renderView("blocks/tile.html", [
                            'tile' => [
                                'type' => "standard",
                                'image' => "/img/pictures/husaria.jpg",
                                'content' => [
                                    'title' => "The winged hussars arrived",
                                    'text' => "The Polish hussars were one of the main types of Polish cavalry in Poland and in the Polish–Lithuanian Commonwealth between the 16th and 18th centuries."
                                ]
                            ]
                        ]), true),
                        'contentRevealing' => highlight_string($this->renderView("blocks/tile.html", [
                            'tile' => [
                                'type' => "content-revealing",
                                'image' => "/img/pictures/husaria.jpg",
                                'content' => [
                                    'title' => "The winged hussars arrived",
                                    'text' => "The Polish hussars were one of the main types of Polish cavalry in Poland and in the Polish–Lithuanian Commonwealth between the 16th and 18th centuries."
                                ]
                            ]
                        ]), true),
                        'contentBeneath' => highlight_string($this->renderView("blocks/tile.html", [
                            'tile' => [
                                'type' => "content-beneath",
                                'image' => "/img/pictures/husaria.jpg",
                                'content' => [
                                    'title' => "The winged hussars arrived",
                                    'text' => "The Polish hussars were one of the main types of Polish cavalry in Poland and in the Polish–Lithuanian Commonwealth between the 16th and 18th centuries."
                                ]
                            ]
                        ]), true)
                    ],
                    'formField' => [
                        'regular' => highlight_string($this->renderView("blocks/form-field.html", [
                            'formField' => [
                                'extraClass' => "",
                                'type' => "with-title",
                                'title' => "Form field with title"
                            ]
                        ]), true),
                        'placeholder' => highlight_string($this->renderView("blocks/form-field.html", [
                            'formField' => [
                                'extraClass' => "",
                                'type' => "with-placeholder",
                                'title' => "Form field with placeholder"
                            ]
                        ]), true),
                        'underline' => highlight_string($this->renderView("blocks/form-field.html", [
                            'formField' => [
                                'extraClass' => " form-field--underline",
                                'type' => "with-placeholder",
                                'title' => "Underlined form field with placeholder"
                            ]
                        ]), true)
                    ],
                    'choiceField' => [
                        'checkbox' => highlight_string($this->renderView("blocks/choice-field.html", [
                            'choiceField' => [
                                'type' => "checkbox",
                                'name' => 'exemplary-checkbox',
                                'value' => 'Exemplary checkbox',
                                'description' => 'Exemplary checkbox'
                            ]
                        ]), true),
                        'radio' => highlight_string($this->renderView("blocks/choice-field.html", [
                            'choiceField' => [
                                'type' => "radio",
                                'name' => 'exemplary-radio-button',
                                'value' => 'Exemplary radio button',
                                'description' => 'Exemplary radio button'
                            ]
                        ]), true)
                    ],
                    'iconItem' => highlight_string($this->renderView("blocks/icon-item.html", []), true),
                    'iconLabel' => [
                        'regular' => highlight_string($this->renderView("blocks/icon-label.html", [
                                'iconLabel' => [
                                    'description' => "Lorem ipsum dolor sit amet"
                                ]
                            ]), true),
                        'decorated' => highlight_string($this->renderView("blocks/icon-label.html", [
                                'iconLabel' => [
                                    'extraClass' => " icon-label--decorated",
                                    'description' => "Lorem ipsum dolor sit amet"
                                ]
                            ]), true)
                    ],
                    'titledLabel' => highlight_string($this->renderView("blocks/titled-label.html", [
                        'titledLabel' => [
                            'title' => "Helpline",
                            'content' => "+48 723 917 812"
                        ]
                    ]), true),
                    'extendedIcon' => highlight_string($this->renderView("blocks/extended-icon.html", [
                    
                    ]), true),
                    'plainExtendedIcon' => highlight_string($this->renderView("blocks/plain-extended-icon.html", [
                    
                    ]), true)
                ],
                'scss' => [
                    'sectionTitle' => highlight_string($titlesCode, true),
                    'text' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/text/_text.scss'), true),
                    'button' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/buttons/_button.scss'), true),
                    'tile' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/objects/_tile.scss'), true),
                    'formField' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/form-fields/_form-field.scss'), true),
                    'choiceField' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/form-fields/_choice-field.scss'), true),
                    'iconItem' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/objects/_icon-item.scss'), true),
                    'iconLabel' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/objects/_icon-label.scss'), true),
                    'titledLabel' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/objects/_titled-label.scss'), true),
                    'extendedIcon' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/icons/_extended-icon.scss'), true),
                    'plainExtendedIcon' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/icons/_plain-extended-icon.scss'), true),
                    'headings' => highlight_string($headersCode, true)
                ]
            ]
        ]);
    }
}