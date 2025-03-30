const staticFormSender = new Hawk.StaticFormSender($('#exemplary-static-form'), [
    new Hawk.TextFormField("chess-figure-name", {
        validate: Hawk.Validator.isNotEmpty
    })
], (formSender) => {
    const validationResult = formSender.validate();

    if (validationResult.length == 0) {
        const field = formSender.getField('chess-figure-name');
        const value = field.getValue().toLowerCase();
        const chessFigures = [
            'knight', 'queen', 'king', 'bishop', 'tower',
            'skoczek', 'koń', 'hetman', 'król', 'goniec', 'laufer', 'wieża'
        ];

        if (chessFigures.indexOf(value) > -1) {
            formSender.options.onCorrect({
                message: "Ok, great!"
            });
        } else {
            formSender.options.onError({
                message: "Cannot you play chess, really?"
            });
        }
    } else {
        formSender.changeMessage("Please fill the fields correctly.");
    }

    formSender.finishWorking();
});
staticFormSender.run();