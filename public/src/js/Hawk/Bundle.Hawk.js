import Hawk from 'HawkLibrary/Core.Hawk';

import AnchorsManager from 'HawkLibrary/AnchorsManager.Hawk';
import BookmarksManager from 'HawkLibrary/BookmarksManager.Hawk';
import Countdown from "./HawkLibrary/Calendar/Countdown.Hawk";
import Dropdown from 'HawkLibrary/Dropdowns/Dropdown.Hawk';
import DetailsList from 'HawkLibrary/DetailsList.Hawk';
import RequestStatus from "./HawkLibrary/Requests/RequestStatus.Hawk";
import SimpleOverlayerManager from "./HawkLibrary/Overlayers/SimpleOverlayerManager.Hawk";
import AjaxOverlayerManager from "./HawkLibrary/Overlayers/AjaxOverlayerManager.Hawk";
import OverlayerManagerMode from "./HawkLibrary/Overlayers/Enums/OverlayerManagerMode.Hawk";
import ConfirmationManager from "./HawkLibrary/Overlayers/ConfirmationManager.Hawk";
import Routes from "./HawkLibrary/Routes.Hawk";
import MoreContentManager from "./HawkLibrary/MoreContentManager.Hawk";
import LayeredSection from "./HawkLibrary/LayeredSection.Hawk";
import SlideMenu from "./HawkLibrary/SlideMenu.Hawk";
import HeightAdjuster from "./HawkLibrary/HeightAdjuster.Hawk";
import EnlargingObject from "./HawkLibrary/EnlargingObject.Hawk";
import ItemsManager from "./HawkLibrary/ItemsManagers/ItemsManager.Hawk";
import AjaxItemsManager from "./HawkLibrary/ItemsManagers/AjaxItemsManager.Hawk";
import AjaxLoadingItemsManager from "./HawkLibrary/ItemsManagers/AjaxLoadingItemsManager.Hawk";
import Pager from "./HawkLibrary/Pageable/Pager.Hawk";
import StepsManager from "./HawkLibrary/Pageable/StepsManager.Hawk";


Hawk.AnchorsManager = AnchorsManager;

Hawk.BookmarksManager = BookmarksManager;
Hawk.Countdown = Countdown;
Hawk.Dropdown = Dropdown;
Hawk.DetailsList = DetailsList;
Hawk.Enlarging = EnlargingObject;
Hawk.HeightAdjuster = HeightAdjuster;
Hawk.LayeredSection = LayeredSection;
Hawk.MoreContentManager = MoreContentManager;
Hawk.SlideMenu = SlideMenu;

Hawk.Pager = Pager;
Hawk.StepsManager = StepsManager;

Hawk.ItemsManager = ItemsManager;
Hawk.AjaxItemsManager = AjaxItemsManager;
Hawk.AjaxLoadingItemsManager = AjaxLoadingItemsManager;

Hawk.OverlayerManagerMode = OverlayerManagerMode;
Hawk.AjaxOverlayerManager = AjaxOverlayerManager;
Hawk.SimpleOverlayerManager = SimpleOverlayerManager;
Hawk.ConfirmationManager = ConfirmationManager;

Hawk.RequestStatus = RequestStatus;
Hawk.Routes = Routes;

export default Hawk;