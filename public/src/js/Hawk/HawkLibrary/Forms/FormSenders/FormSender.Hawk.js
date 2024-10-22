import Hawk from "../../Core.Hawk";
import SingleThreadClass from "../../Basements/SingleThreadClass.Hawk";

export default class FormSender extends SingleThreadClass {
  constructor(form, fields, options, multifields) {
    super();

    this.form = $(form);
    this.fields = {};

    if (typeof multifields != "undefined") {
      this.multifields = multifields;
    } else {
      this.multifields = [];
    }

    for (let i in fields) {
      const field = fields[i];

      this.fields[field.getName()] = field;
    }

    this.defaultOptions = this.getDefaultOptions();

    this.options = Hawk.mergeObjects(this.defaultOptions, options);

    this.infoContainer = this.form.find("." + this.options.infoContainerClass);
    this.infoWrapper = this.form.find("." + this.options.infoWrapperClass);
    this.info = this.form.find("." + this.options.infoClass);
    this.spinner = this.form.find("." + this.options.spinnerClass);

    this.button = this.options.obtainButton(this.form);
    this.cancelButton = this.options.obtainCancelButton(this.form);
  }

  getDefaultOptions() {
    return {
      autoDisable: true,
      extraData: {},
      fadeSpeed: 200,
      slideSpeed: 200,

      infoContainerClass: "form__info-container",
      infoWrapperClass: "form__info-wrapper",
      infoClass: "form__info",
      spinnerClass: "form__spinner",

      obtainButton: (form) => {
        return form.find('button[type="submit"]');
      },
      obtainCancelButton: (form) => {
        return form.find(".form__cancel-button");
      },

      onSuccess: (result) => {
        this.defaultResultCallback(result, "success");
      },
      onPending: (result) => {
        this.defaultResultCallback(result, "");
      },
      onError: (result) => {
        this.defaultResultCallback(result, "failure");
      },
      onException: (result) => {
        if (typeof result != "undefined") {
          this.defaultResultCallback(result, "failure");
        }
      },
      onComplete: () => {},
    };
  }

  defaultResultCallback(result, className) {
    if (typeof className == "undefined") {
      className = "";
    }

    this.checkFields(result.errorFields);
    this.checkMultifields(result.errorMultifields);
    this.changeMessage(
      '<p class="' + className + '">' + result.message + "</p>"
    );
  }

  getField(name) {
    return this.fields[name];
  }

  checkFields(incorrectFields) {
    for (let i in this.fields) {
      const current = this.fields[i];

      if (Hawk.isInObject(current.name, incorrectFields)) {
        current.markAsIncorrect();
      } else {
        current.clear();
      }
    }

    return this;
  }

  checkMultifields(incorrectMultifields) {
    if (this.multifields.length > 0) {
      for (const multifield of this.multifields) {
        multifield.refreshFields(this);

        if (incorrectMultifields.hasOwnProperty(multifield.getName())) {
          multifield.checkFields(incorrectMultifields[multifield.getName()]);
        } else {
          multifield.clear();
        }
      }
    }

    return this;
  }

  validate() {
    let result = [];

    for (let i in this.fields) {
      const current = this.fields[i];

      if (current.validate()) {
        current.clear();
      } else {
        current.markAsIncorrect();

        result.push(current.getName());
      }
    }

    return result;
  }

  bindFields() {
    for (let i in this.fields) {
      const current = this.fields[i];

      current.run(this.form);
    }

    return this;
  }

  hasMessageBeenShown() {
    return this.infoWrapper.is(":visible");
  }

  changeMessage(message) {
    if (this.hasMessageBeenShown()) {
      this.slideMessage(message);
    } else {
      this.hideMessage(() => {
        this.slideMessage(message);
      });
    }
  }

  slideMessage(message) {
    this.info.html(message);

    this.infoWrapper.velocity("slideDown", {
      duration: this.options.slideSpeed,
      complete: () => {
        this.showMessage();
      },
    });
  }

  showMessage() {
    this.info.velocity(
      { opacity: 1 },
      {
        duration: 200,
      }
    );
  }

  hideMessage(callback) {
    this.info.velocity(
      { opacity: 0 },
      {
        duration: this.options.fadeSpeed,
        complete: () => {
          if (typeof callback != "undefined") {
            callback();
          }
        },
      }
    );
  }

  clearMessage() {
    this.hideMessage(() => {
      this.info.html("");
    });
  }

  showSpinner() {
    this.spinner.css({ opacity: 1 });

    return this;
  }

  hideSpinner() {
    this.spinner.css({ opacity: 0 });

    return this;
  }

  collectData(form) {
    const data = new FormData(form);

    for (let key in this.options.extraData) {
      if (typeof this.options.extraData[key] == "function") {
        data.append(key, this.options.extraData[key]());
      } else {
        data.append(key, this.options.extraData[key]);
      }
    }

    return data;
  }

  disable() {
    this.form.attr("disabled", "disabled");

    this.form.find("input, textarea").attr("disabled", "disabled");

    return this;
  }

  hideButton() {
    this.button.velocity(
      { opacity: 0 },
      {
        duration: this.options.fadeSpeed,
        complete: () => {
          this.button.css({ visibility: "hidden" });
        },
      }
    );
  }

  clear() {
    for (let i in this.fields) {
      const current = this.fields[i];

      current.clear();
    }

    return this;
  }

  clearValues() {
    for (let i in this.fields) {
      const current = this.fields[i];

      current.clearValue();
    }

    return this;
  }

  run() {
    this.bindFields();

    this.form.submit((e) => {
      e.preventDefault();

      this.submit();
    });
  }

  submit() {
    if (!this.isWorking()) {
      this.startWorking();

      this.showSpinner();

      this.send();
    }
  }

  send() {
    throw new Error("This method should be overwritten in the subclass.");
  }
}
