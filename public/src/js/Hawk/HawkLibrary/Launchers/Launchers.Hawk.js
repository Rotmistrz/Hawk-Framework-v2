Hawk.Launchers = {};

Hawk.Launchers.DetailsList = function(elements, options) {
    const collection = $(elements);

    const instances = [];

    collection.each(function() {
        const instance = new Hawk.DetailsList($(this), options);
        instance.run();
    });

    return instances;
}