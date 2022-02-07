<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class MasterController extends AbstractController {

    /**
     * @Route("/")
     */
    public function index() {
        return $this->render('home.html', [
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
                                'description' => "current dropdown"
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
                                'description' => "current dropdown"
                            ]
                        ]
                    ],

                    [
                        'name' => "onRadioSelected",
                        'description' => "Is being executed immediately after one of the options is selected. It refers only to radio fields.",
                        'parameters' => [
                            [
                                'name' => "dropdown",
                                'type' => "Hawk.Dropdown",
                                'description' => "current dropdown"
                            ],
                            [
                                'name' => "radio",
                                'type' => "DOM.Input",
                                'description' => "selected field"
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
                        'description' => "-",
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
                        'name' => "selectByIndex",
                        'type' => "boolean",
                        'description' => "Selects the option by the position on the list. 0 is the first index. Returns <code class=\"inline-code\">true</code> if the option exists and has been sucessfully chosen, <code class=\"inline-code\">false</code> otherwise.",
                        'parameters' => [
                            
                        ]
                    ],
                    [
                        'name' => "selectByValue",
                        'type' => "boolean",
                        'description' => "Selects the option by the value of the field. Returns <code class=\"inline-code\">true</code> if the option exists and has been sucessfully chosen, <code class=\"inline-code\">false</code> otherwise.",
                        'parameters' => [
                            
                        ]
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
                    ]), true)
                ],
                'scss' => [
                    'sectionTitle' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_titles.scss'), true),
                    'text' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_text.scss'), true),
                    'button' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_buttons.scss'), true),
                    'tile' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_tiles.scss'), true),
                    'formField' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_form-fields.scss'), true),
                    'choiceField' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_choice-fields.scss'), true),
                    'iconItem' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_icon-item.scss'), true),
                    'iconLabel' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_icon-label.scss'), true),
                    'titledLabel' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_titled-label.scss'), true),
                    'headings' => highlight_string(file_get_contents(DIR_SCSS_HAWK_BLOCKS . '/_headings.scss'), true)
                ]
            ]
        ]);
    }
}