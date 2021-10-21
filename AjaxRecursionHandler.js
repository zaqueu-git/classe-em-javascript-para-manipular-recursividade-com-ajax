class AjaxRecursionHandler {

    constructor() {
        this.groups = null;
        this.records = null;
        this.calcPorc = 0;
        this.parameters = null;
        this.urlGet = null;
        this.urlSend = null;
        this.callbackError = null;
        this.callbackFinished = null;
        this.callbackLoading = null;
    }

    setUrlGet(urlGet) {
        this.urlGet = urlGet;
    }

    setUrlSend(urlSend) {
        this.urlSend = urlSend;
    }

    setCallbackFinished(callbackFinished) {
        this.callbackFinished = callbackFinished;
    }

    setCallbackError(callbackError) {
        this.callbackError = callbackError;
    }

    setCallbackLoading(callbackLoading) {
        this.callbackLoading = callbackLoading;
    }

    get() {
        var callback = this;

        $.ajax({
            url: this.urlGet,
            type: "POST",
            dataType: "json",
            success: function (data) {
                callback.groups = data;
                callback.records = data.length;
                callback.prepare();
            }, error: function () {
                callback.error();
            }
        });
    }

    prepare() {
        this.loading();

        if (this.groups.length == 0) {
            return this.finished();
        }

        this.parameters = this.groups[0];

        this.groups.shift();

        this.send();
    }

    send() {
        var callback = this;

        $.ajax({
            url: this.urlSend,
            type: "POST",
            timeout: 8000,
            data: this.parameters,
            success: function () {
                callback.prepare();
            },
            error: function () {
                callback.prepare();
            }
        });
    }

    error() {
        if (this.callbackError) {
            return this.callbackError();
        }
    }

    finished() {
        if (this.callbackFinished) {
            return this.callbackFinished();
        }
    }
    
    loading() {
        var dif = (this.records - this.groups.length);

        if (dif == 0) {
            var res = 0;
        } else {
            var res = (dif / this.records) * 100;
        }

        this.calcPorc = res.toFixed();

        this.callbackFinished();

        this.callbackLoading(this.calcPorc);
    }
}











