import Hawk from "./HawkLibrary/Core.Hawk";

import ComponentsConstants from "./HawkLibrary/Components/ComponentConstants.Hawk";

import AnchorsManager from "./HawkLibrary/AnchorsManager.Hawk";
import BookmarksManager from "./HawkLibrary/BookmarksManager.Hawk";
import Countdown from "./HawkLibrary/Calendar/Countdown.Hawk";
import Dropdown from "./HawkLibrary/Dropdowns/Dropdown.Hawk";
import DetailsList from "./HawkLibrary/DetailsList.Hawk";
import RequestStatus from "./HawkLibrary/Requests/RequestStatus.Hawk";
import SimpleOverlayerManager from "./HawkLibrary/Overlayers/SimpleOverlayerManager.Hawk";
import AjaxOverlayerManager from "./HawkLibrary/Overlayers/AjaxOverlayerManager.Hawk";
import OverlayerManagerMode from "./HawkLibrary/Overlayers/Enums/OverlayerManagerMode.Hawk";
import ConfirmationManager from "./HawkLibrary/Overlayers/ConfirmationManager.Hawk";
import Routes from "./HawkLibrary/Routes.Hawk";
import MoreContentManager from "./HawkLibrary/MoreContentManager.Hawk";
import LayeredSection from "./HawkLibrary/LayeredSection.Hawk";
import SlidingMenu from "./HawkLibrary/SlidingMenu.Hawk";
import HeightAdjuster from "./HawkLibrary/HeightAdjuster.Hawk";
import EnlargingObject from "./HawkLibrary/EnlargingObject.Hawk";
import ItemsManager from "./HawkLibrary/ItemsManagers/ItemsManager.Hawk";
import AjaxItemsManager from "./HawkLibrary/ItemsManagers/AjaxItemsManager.Hawk";
import AjaxLoadingItemsManager from "./HawkLibrary/ItemsManagers/AjaxLoadingItemsManager.Hawk";
import Pager from "./HawkLibrary/Pageable/Pager.Hawk";
import StepsManager from "./HawkLibrary/Pageable/StepsManager.Hawk";
import Validator from "./HawkLibrary/Validation/Validator.Hawk";
import ChoiceFormField from "./HawkLibrary/Forms/Fields/ChoiceFormField.Hawk";
import TextFormField from "./HawkLibrary/Forms/Fields/TextFormField.Hawk";
import TextareaFormField from "./HawkLibrary/Forms/Fields/TextareaFormField.Hawk";
import FileFormField from "./HawkLibrary/Forms/Fields/FileFormField.Hawk";
import AjaxFormSender from "./HawkLibrary/Forms/FormSenders/AjaxFormSender.Hawk";
import StaticFormSender from "./HawkLibrary/Forms/FormSenders/StaticFormSender.Hawk";
import SectionDetector from "./HawkLibrary/SectionDetector.Hawk";
import Toggler from "./HawkLibrary/Toggler.Hawk";

Hawk.ComponentsConstants = ComponentsConstants;

Hawk.AnchorsManager = AnchorsManager;

Hawk.BookmarksManager = BookmarksManager;
Hawk.Countdown = Countdown;
Hawk.Dropdown = Dropdown;
Hawk.DetailsList = DetailsList;
Hawk.Enlarging = EnlargingObject;
Hawk.HeightAdjuster = HeightAdjuster;
Hawk.LayeredSection = LayeredSection;
Hawk.MoreContentManager = MoreContentManager;
Hawk.SlidingMenu = SlidingMenu;

Hawk.ChoiceFormField = ChoiceFormField;
Hawk.TextFormField = TextFormField;
Hawk.TextareaFormField = TextareaFormField;
Hawk.FileFormField = FileFormField;

Hawk.AjaxFormSender = AjaxFormSender;
Hawk.StaticFormSender = StaticFormSender;

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

Hawk.SectionDetector = SectionDetector;

Hawk.Toggler = Toggler;

Hawk.Validator = Validator;

export default Hawk;
