Hawk.AjaxFormSender = class extends Hawk.FormSender {
	constructor(form, fields, path, options, multifields) {
		super(form, fields, options, multifields);

		this.path = path;
	}

	getDefaultOptions() {
        let defaultOptions = super.getDefaultOptions();
        defaultOptions.method = "POST";

        return defaultOptions;
    }

    send() {
		const data = this.collectData(this.form.get(0));

		$.ajax({
            url: this.path,
            type: this.options.method,
            data: data,
            cache: false,
            processData: false, // Don't process the files
            contentType: false,
            dataType: 'json',
            success: (result) => {
                //console.log(result);

                if (result.status == Hawk.RequestStatus.SUCCESS) {
                    this.clear();

                    if (this.options.autoDisable) {
                    	this.hideButton();

                    	this.disable();
                    }

                    this.options.onSuccess(result);
                } else if (result.status == Hawk.RequestStatus.PENDING) {
                    this.options.onPending(result);
                } else if (result.status == Hawk.RequestStatus.ERROR) {
                	this.options.onError(result);
                } else {
                	this.options.onException(result);
                }
            },
            error: (jqXHR, textStatus, errorThrown) => {
                //console.log(jqXHR.responseText);

                this.changeMessage("There occurred an unexpected error during processing the form. Please try again later.");

                //console.log(errorThrown);

                if (typeof this.options.onException == 'function') {
                    this.options.onException();
                }
            },
            complete: (jqXHR) => {
                this.hideSpinner();

                this.finishWorking();

                this.options.onComplete();
            }
        });
	}
}