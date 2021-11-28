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
                ]
            ],

            'slidingLayerManager' => [
                'listings' => [
                    'html' => highlight_string($this->renderView("hawk/modules/sliding-layer-manager/hawk-sliding-layer-manager.html", [
                    ]), true),
                    'js' => highlight_string($this->renderView("hawk/modules/sliding-layer-manager/sliding-layer-manager.js", [
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