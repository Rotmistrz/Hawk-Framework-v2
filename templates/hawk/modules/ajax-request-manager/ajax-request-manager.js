var ajaxRequestContainer = {
    result: $('.simple-ajax-request-container__result'),
    button: $('.simple-ajax-request-container__button')
};

var ajaxRequestManager = new Hawk.AjaxRequestManager({
    // options and callbacks
});

ajaxRequestContainer.button.click(function() {
    ajaxRequestManager.get("/examples/ajax-request-manager/draw-a-colour", {
        onSuccess: function(result) {
            ajaxRequestContainer.result.html(result.colour);
        },
        onError: function() {
            ajaxRequestContainer.result.html("");
        },
        onException: function() {
            ajaxRequestContainer.result.html("");
        }
    });
});
