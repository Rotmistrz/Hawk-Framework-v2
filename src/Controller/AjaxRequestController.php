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
            ],

            [
                'image' => '/img/pictures/husaria-w-gorach.jpg'
            ],
            [
                'image' => '/img/pictures/jezioro-o-poranku.jpg'
            ],
            [
                'image' => '/img/pictures/odra-wieczorem.jpg'
            ]
        ];

        $amount = count($source);

        $html = "";
        $items = [];

        for ($i = $offset, $n = 0; $n < $itemsPerLoading && $i < $amount; $i++, $n++) {
            $items[] = $source[$i];

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
    		'html' => $html,
            'items' => $items,
            'offset' => $offset,
            'isDone' => $isDone
    	]);
    }

    /**
     * @Route("/ajax/load-page")
     */
    public function ajaxLoadPage(Request $request) {
        $page = intval($request->get('page'));
        $itemsPerPage = $request->get('itemsPerPage');

        $exemplaryTexts = [
            "Lorem ipsum dolor sit amet",
            "In cursus at, rhoncus wisi. Nam in faucibus quis, ornare tellus. Fusce vitae metus.",
            "Praesent est et ligula. Sed fringilla vel, urna. Phasellus vestibulum. Nulla massa.",
            "Aliquam consequat pharetra. Cras aliquet. In hac habitasse platea dictumst. Duis sed felis mollis ultrices, velit non eros.",
            "Phasellus pulvinar nec, dignissim turpis. Duis sodales turpis, fermentum sed, sollicitudin id",
            "Phasellus laoreet sit amet, consectetuer congue id, mattis adipiscing. Vestibulum laoreet, est et mauris ac arcu.",
            "Duis luctus et ultrices ut, accumsan at, nisl. Nam diam. Donec ornare vel, urna.",
            "Cum sociis natoque penatibus et netus et odio. Aliquam ultricies lacinia porta.",
            "Cras in magna arcu, rutrum et, pharetra nulla in consequat lobortis augue sed felis. Aenean interdum eu, vulputate aliquam odio.",
            "Vivamus dignissim enim interdum eu, tempus tellus. Donec lectus sit amet libero fermentum tortor",
            "Curabitur sit amet dolor. Ut vel tincidunt consequat, orci luctus sagittis. Vestibulum ornare pulvinar gravida",
            "Aliquam tellus non eros sem luctus congue, lorem lorem eros tincidunt mi, ut viverra neque, a leo nec tristique vitae",
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per conubia nostra",
            "Maecenas nec nisl auctor euismod. Ut molestie venenatis interdum, lacus. Aenean faucibus massa",
            "Lorem ipsum et turpis. Vivamus nec diam. Donec eu mauris. Etiam dolor. Suspendisse at lacus ultrices",
            "Phasellus posuere vitae, arcu. Vivamus nibh. Donec commodo, volutpat ut, dolor. Ut a sapien",
            "Nam sed massa volutpat at, venenatis eu, ligula. Phasellus quis sollicitudin magna.",
            "Phasellus metus bibendum purus vitae nunc vel ligula eget gravida diam. In quis tortor.",
            "Sed in faucibus eros sem in dolor. Integer sollicitudin leo lobortis facilisis. Maecenas orci ipsum",
            "Duis luctus et ultrices ut, accumsan at, nisl. Nam diam. Donec ornare vel, urna.",
            "Cum sociis natoque penatibus et netus et odio. Aliquam ultricies lacinia porta.",
            "Cras in magna arcu, rutrum et, pharetra nulla in consequat lobortis augue sed felis. Aenean interdum eu, vulputate aliquam odio.",
            "Vivamus dignissim enim interdum eu, tempus tellus. Donec lectus sit amet libero fermentum tortor",
            "Curabitur sit amet dolor. Ut vel tincidunt consequat, orci luctus sagittis. Vestibulum ornare pulvinar gravida",
            "Aliquam tellus non eros sem luctus congue, lorem lorem eros tincidunt mi, ut viverra neque, a leo nec tristique vitae",
            "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per conubia nostra",
            "Maecenas nec nisl auctor euismod. Ut molestie venenatis interdum, lacus. Aenean faucibus massa",
            "Lorem ipsum et turpis. Vivamus nec diam. Donec eu mauris. Etiam dolor. Suspendisse at lacus ultrices",
            "Phasellus posuere vitae, arcu. Vivamus nibh. Donec commodo, volutpat ut, dolor. Ut a sapien",
            "Nam sed massa volutpat at, venenatis eu, ligula. Phasellus quis sollicitudin magna.",
            "Phasellus metus bibendum purus vitae nunc vel ligula eget gravida diam. In quis tortor.",
            "Sed in faucibus eros sem in dolor. Integer sollicitudin leo lobortis facilisis. Maecenas orci ipsum"
        ];

        $startOffset = ($page - 1) * $itemsPerPage;

        $items = array_slice($exemplaryTexts, $startOffset, $itemsPerPage);

        $html = "";

        foreach ($items as $item) {
            $html .= "<li>";

            $html .= $this->renderView('this-project/text-box.html', [
                'content' => $item
            ]);

            $html .= "</li>";
        }

        return new JsonResponse([
            'status' => RequestStatus::SUCCESS,
            'html' => $html,
            'page' => $page,
            'allItemsAmount' => count($exemplaryTexts)
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
            $result['message'] = "Ok, " . $name;
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

    /**
     * @Route("/ajax/load-overlayer")
     */
    public function loadOverlayer(Request $request) {
        sleep(2);

        $id = $request->get('id');

        $result['status'] = RequestStatus::SUCCESS;
        $result['html'] = "Lorem ipsum dolor sit amet.";
        $result['id'] = $id;

        return new JsonResponse($result);
    }
}