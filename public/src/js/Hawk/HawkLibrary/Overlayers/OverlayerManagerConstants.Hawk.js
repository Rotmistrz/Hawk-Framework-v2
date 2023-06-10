Hawk.AjaxOverlayerManagerConstants = {
    Modes: {
        DEFAULT: 0,
        DELEGATE_EVENTS: 1
    },

    getDefaultHashPattern: () => {
        return "^o\/[0-9]+\/[a-zA-Z\-_0-9]+\/[a-zA-Z\-_0-9]+(\/)?(((&)*[a-zA-Z0-9]+=[a-zA-Z0-9]+)*)?$";
    }
};

Hawk.OverlayerManagerConstants = {
    Modes: {
        DEFAULT: 0,
        DELEGATE_EVENTS: 1
    },

    getDefaultHashPattern: () => {
        return "^o\/[0-9]+\/[a-zA-Z\-_0-9]+\/[a-zA-Z\-_0-9]+(\/)?(((&)*[a-zA-Z0-9]+=[a-zA-Z0-9]+)*)?$";
    }
};