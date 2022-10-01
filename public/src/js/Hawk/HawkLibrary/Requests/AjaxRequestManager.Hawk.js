Hawk.AjaxRequestManager = function(options) {
    const that = this;

    this.ajaxRequest;
    this.ajaxRequestWorking = false;

    this.defaultOptions = {
        onSuccess: function() {},
        onError: function() {},
        onException: function() {},
        onFailure: function() {},
        onComplete: function() {}
    };

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.post = function(path, bundle, callbacks) {
        this.sendRequest(path, Hawk.RequestType.POST, bundle, callbacks);
    }

    this.get = function(path, callbacks) {
        this.sendRequest(path, Hawk.RequestType.GET, {}, callbacks);
    }

    this.sendRequest = function(path, type, bundle, callbacks) {
        if (this.ajaxRequestWorking) {
            return false;
        }

        this.ajaxRequestWorking = true;

        const onSuccess = callbacks.onSuccess || this.options.onSuccess;
        const onFailure = callbacks.onFailure || this.options.onFailure;
        const onError = callbacks.onError || this.options.onError;
        const onException = callbacks.onException || this.options.onException;
        const onComplete = callbacks.onComplete || this.options.onComplete;

        this.ajaxRequest = $.ajax({
            type: type,
            url: path,
            dataType: "json",
            data: bundle,
            success: function(result) {
                console.log(result);

                if (typeof result.status != 'undefined' && result.status == Hawk.RequestStatus.SUCCESS) {
                    console.log("SUCCESS");
                    onSuccess(result);
                } else if (typeof result.status != 'undefined' && result.status == Hawk.RequestStatus.ERROR) {
                    console.log("ERROR");
                    onError(result);
                } else {
                    console.log("EXCEPTION");
                    onException(result);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log(jqXHR.responseText);

                onFailure(jqXHR.responseText);
            },
            complete: function() {
                that.ajaxRequestWorking = false;

                onComplete();
            }
        });

        return this;
    }
}