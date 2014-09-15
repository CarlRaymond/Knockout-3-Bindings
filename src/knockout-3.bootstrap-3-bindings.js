// The modal binding controls Bootstrap modal dialog visibility.  Bind a dialog
// like this:
// <div class="modal fade" data-bind="modal: {keyboard: false,  backdrop: 'static',  show: visible }">...
// The binding options are passed to the modal.  Here the 'show' property refers to a boolean observable
// in the viewmodel named visible, which controls dialog visibility.
//
// The binding is two-way, so that showing or hiding the dialog via Bootstrap will update the
// observable.
ko.bindingHandlers.modal = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var options = ko.utils.unwrapObservable(valueAccessor() || {});
		
		// Evaluate observable to get initial state
		var initshow = options.show();
		options.show = initshow;
		jQuery(element).modal(options);

		// Bind modal visibility events to observable
		jQuery(element).on('hide.bs.modal', function () {
			var options = ko.utils.unwrapObservable(valueAccessor() || {});
			options.show(false);
		});

		jQuery(element).on('show.bs.modal', function () {
			var options = ko.utils.unwrapObservable(valueAccessor() || {});
			options.show(true);
		});

	},

	update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
		var options = ko.utils.unwrapObservable(valueAccessor() || {});
		jQuery(element).modal(options.show() ? 'show' : 'hide');
	}
};

