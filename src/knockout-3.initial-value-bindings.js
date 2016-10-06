// Knockout bindings to set the initial value of an observable
// from the value rendered in the markup.
//
// These were shamelessly stolen from http://stackoverflow.com/a/21715390/144604
// by Joe Esposito, https://github.com/joeyespo

// Order matters. When using the initXXX bindings with the value or checked
// bindings, specify the initXXX binding first. Or just use valueWithInit
// or checkedWithInit, which will attach them in the right order.

// Set initial value of observable from value in markup
ko.bindingHandlers.initValue = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        if (!ko.isWriteableObservable(value)) {
            throw new Error('Knockout "initValue" binding expects an observable.');
        }
        value(element.value);
    }
};

// Set initial value of (boolean) observable bound to checkbox from value in markup
ko.bindingHandlers.initChecked = {
    init: function (element, valueAccessor) {
        var value = valueAccessor();
        if (!ko.isWriteableObservable(value)) {
            throw new Error('Knockout "initChecked" binding expects an observable.');
        }
        value(element.checked);
    }
};

// Combine "value" and "initValue" bindings
ko.bindingHandlers.valueWithInit = {
    init: function (element, valueAccessor, allBindings, data, context) {
        ko.applyBindingsToNode(element, { initValue: valueAccessor() }, context);
        ko.applyBindingsToNode(element, { value: valueAccessor() }, context);
    }
};

// Combine "checked' and "initChecked" bindings
ko.bindingHandlers.checkedWithInit = {
    init: function (element, valueAccessor, allBindings, data, context) {
        ko.applyBindingsToNode(element, { initChecked: valueAccessor() }, context);
        ko.applyBindingsToNode(element, { checked: valueAccessor() }, context);
    }
};
