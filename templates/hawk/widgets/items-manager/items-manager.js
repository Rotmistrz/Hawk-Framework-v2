import ItemsManagerMode from "./Hawk/HawkLibrary/ItemsManagers/Enums/ItemsManagerMode.Hawk";

App.Widgets.ItemsManagers.Exemplary = new Hawk.ItemsManager($('#exemplary-items-manager'), {
    mode: ItemsManagerMode.CHOICE
});
App.Widgets.ItemsManagers.Exemplary.run();