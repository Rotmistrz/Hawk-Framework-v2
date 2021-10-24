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
            'listings' => [
                1 => highlight_string($this->renderView("hawk/modules/dropdown/hawk-dropdown.html", [
                    'dropdown' => [
                        'id' => "exemplary-dropdown",
                        'title' => "Exemplary dropdown"
                    ],
                    'autoescapeFalse' => false
                ]), true)
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
                    ]
                ],
                'scss' => [
                    'sectionTitle' => highlight_string(file_get_contents(ROOT_DIR . '/public/src/scss/blocks/_section-title.scss'), true),
                    'text' => highlight_string(file_get_contents(ROOT_DIR . '/public/src/scss/blocks/_text.scss'), true),
                    'button' => highlight_string(file_get_contents(ROOT_DIR . '/public/src/scss/blocks/_buttons.scss'), true),
                    'tile' => highlight_string(file_get_contents(ROOT_DIR . '/public/src/scss/blocks/_tiles.scss'), true),
                    'formField' => highlight_string(file_get_contents(ROOT_DIR . '/public/src/scss/blocks/_form-fields.scss'), true),
                    'choiceField' => highlight_string(file_get_contents(ROOT_DIR . '/public/src/scss/blocks/_choice-fields.scss'), true)
                ]
            ]
        ]);
    }
}