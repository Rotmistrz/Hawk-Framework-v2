<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Requests\RequestStatus;

class AjaxRequestController extends AbstractController {

    /**
     * @Route("/ajax/load-items")
     */
    public function ajaxLoad(Request $request) {
	    $offset = intval($request->get('offset'));
	    $itemsPerLoading = $request->get('itemsPerLoading');

        $source = [
        	[
        		'image' => '/img/pictures/husaria.jpg'
        	],
        	[
        		'image' => '/img/pictures/husaria-w-gorach.jpg'
        	],
        	[
        		'image' => '/img/pictures/husaria-02.jpg'
        	],

            [
                'image' => '/img/pictures/panna-rycerz.jpg'
            ],
            [
                'image' => '/img/pictures/husarz-z-kopia.jpg'
            ],
            [
                'image' => '/img/pictures/husaria.jpg'
            ]
        ];

        $amount = count($source);

        $html = "";

        for ($i = $offset, $n = 0; $n < $itemsPerLoading && $i < $amount; $i++, $n++) {
            $html .= "<li>";

        	$html .= $this->renderView('blocks/tile.html', [
        		'tile' => [
        			'type' => 'clear',
        			'image' => $source[$i]['image']
        		]
        	]);

            $html .= "</li>";

            $offset++;
        }

        if ($offset < $amount) {
            $isDone = false;
        } else {
            $isDone = true;
        }

    	return new JsonResponse([
    		'items' => $html,
            'offset' => $offset,
            'isDone' => $isDone
    	]);
    }


    /**
     * @Route("/ajax/chess-figure")
     */
    public function ajaxChessFigure(Request $request) {
        $favouriteFigure = $request->get('favourite-figure');
        $name = trim($request->get('name'));

        $messages = [];

        $errorFields = [];

        if (strlen($name) < 1) {
            $errorFields[] = "name";
            $messages[] = "Please type Your name.";
        }

        if (is_null($favouriteFigure)) {
            $errorFields[] = "favourite-figure";
            $messages[] = "Please choose at least one figure.";
        }

        $result = [];

        $result['status'] = (count($errorFields) == 0) ? RequestStatus::SUCCESS : RequestStatus::ERROR;
        $result['errorFields'] = $errorFields;

        if (count($messages) > 0) {
            $result['message'] = implode('<br />', $messages);
        } else {
            $result['message'] = "Ok, ";
        }
        

        return new JsonResponse($result);
    }

    /**
     * @Route("/ajax/draw-a-colour")
     */
    public function ajaxDrawColour() {
        if (time() % 2 == 0) {
            $colour = "Whites";
        } else {
            $colour = "Blacks";
        }

        $result['status'] = RequestStatus::SUCCESS;
        $result['colour'] = $colour;

        return new JsonResponse($result);
    }
}