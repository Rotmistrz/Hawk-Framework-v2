<?php

namespace App\Controller;

use Symfony\Component\HttpFoundation\RedirectResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

class AjaxRequestController extends AbstractController {

    /**
     * @Route("/ajax/load-items")
     */
    public function ajaxLoad(Request $request) {

    	/*

    	{% include('blocks/tile.html') with {
	        tile: {
	            type: 'clear',
	            image: '/img/pictures/husaria.jpg'
	        }
	    } %}

        */


	    $offset = $request->get('offset');
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
        	]
        ];

        $amount = count($source);

        $html = "";

        for ($i = $offset; $i < $itemsPerLoading && $i < $amount; $i++) {
        	$html .= $this->renderView('blocks/tile.html', [
        		'tile' => [
        			'type' => 'clear',
        			'image' => $source[$i]['image']
        		]
        	]);
        }

    	return new JsonResponse([
    		'items' => $html
    	]);
    }
}