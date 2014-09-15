// The chosen binding binds to a dropdown using the Chosen enhancement for listboxes (http://harvesthq.github.io/chosen/)
// It replaces (and delegates to) the options binding for most of its behavior, and is used
// with the companion bindings for options, like value:, optionsText:, optionsValue:, etc.
// Bind like this:
// <select data-bind="chosen: { data: List, disable_search_threshold: 10, width: '100%' }, value: SelectedItem, optionsCaption: 'Select an item' "></select>
// If there are no Chosen options, the short form is
// <select data-bind="chosen: List, value: SelecteItem ... ></select>
// The data property binds the list of values, and other properties are passed to the Chosen initializer
ko.bindingHandlers.chosen = {
	init: function (element, valueAccessor, allBindings, viewMode, bindingContext) {

		// Delegate to options binding. If the bindings is an object, the accessor
		// is the data property.
		var optionsAccessor = valueAccessor;
		var params = valueAccessor();
		if (typeof params === 'object') {
			// The data property is the accessor
			optionsAccessor = params.data;
		}
		ko.bindingHandlers.options.init(element, optionsAccessor, allBindings, viewMode, bindingContext)

		// Apply Chosen options.
		jQuery(element).chosen(params);

		// Subscribe to the value binding to update Chosen when the selected value changes
		allBindings().value.subscribe(function () {
			jQuery(element).trigger('chosen:updated');
		});

	},

	update: function (element, valueAccessor, allBindings) {

		// Delegate to options binding. If the bindings is an object, the accessor
		// is the data property.
		var optionsAccessor = valueAccessor;
		var params = valueAccessor();
		if (typeof params === 'object') {
			// The data property is the accessor
			optionsAccessor = params.data;
		}
		ko.bindingHandlers.options.update(element, optionsAccessor, allBindings)

		// Inform Chosen of an update
		jQuery(element).trigger('chosen:updated');
	}
};
