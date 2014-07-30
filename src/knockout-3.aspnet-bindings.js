// Assigns an ASP.Net MVC-style name attribute to a form field that is part of a list.
// Used inside a foreach: binding.
// Example for an indexed primitive type (string, int, etc.) :
// <div data-bind="foreach: Items">
// <input type="text" data-bind="value: SomeValue, aspnetIndexedName: 'Items'" />
// </div>
//
// The above will name the input fields "Items[0]", "Items[1]", etc.  For a complex type,
// a property can be specified in addition to the name:
// <div data-bind="foreach: Items">
// <input type="text" data-bind="value: FirstName, aspnetIndexedName: 'Items.FirstName' }" />
// </div>
//
// The above will name the input fields "Items[0].FirstName", "Items[1].FirstName", etc.
//

ko.bindingHandlers.aspnetIndexedName = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

		var expr = valueAccessor();
		if (typeof expr !== 'string') {
			throw new Error("aspnetIndexedName expression must be a string.");
		}

		// Split on dots
		var parts = expr.split(".");
		var count = parts.length;

		var name, part;

		if (count == 1) {
			// Just a name.  Write as name[0], name[1], etc.
			name = parts[0] + '[' + bindingContext.$index + ']';
		}

		else {
			// Multiple parts.  Last part is the property name
			name = parts[count - 1];

			// Walk up the context chain and add each part
			var ctx = bindingContext;
			for (var i = count - 2; i >= 0; i--) {
				var part = parts[i];
				var index = ctx.$index();

				name = part + '[' + index + '].' + name;

				ctx = ctx.$parentContext;
			}
		}

		$(element).attr({ name: name, id: name });

	}
};


// Populates an ASP.Net MVC validation control that is rendered within a foreach: binding.  The
// data-valmsg-for attribute is given the name of the input control, and the validation
// message is inserted.
// The validation messages must be serialized into the viewmodel.
//
// Example markup:
// <div data-bind="foreach: Items">
//   <input type="text" data-bind="value: FirstName, aspnetIndexedName: 'Items.FirstName' }" />
//   <span class="control-label" data-bind="aspnetIndexedValidation: 'Items.FirstName'}" />
// </div>
//
// To render validation errors, the ASP.Net MVC model state must be available through the viewmodel. One way to
// do this is:
// function MyViewModel {
//   var self = this;
//   ...
//   // Serialize the model state to capture the validation messages.
//   self.modelState = @Html.Raw(Newtonsoft.Json.JsonConvert.SerializeObject(ViewData.ModelState));
// }
ko.bindingHandlers.aspnetIndexedValidation = {
	init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

		var bindings = { modelState: 'modelState' };
		var expr = valueAccessor();
		if (typeof expr === 'string') {
			$.extend(bindings, { name: expr });
		}
		else {
			$.extend(bindings, expr);
		}


		// Split on dots
		var parts = bindings.name.split(".");
		var count = parts.length;

		var name, part;

		if (count == 1) {
			// Just a name.  Write as name[0], name[1], etc.
			name = parts[0] + '[' + bindingContext.$index + ']';
		}

		else {
			// Multiple parts.  Last part is the property name
			name = parts[count - 1];

			// Walk up the context chain and add each part
			var ctx = bindingContext;
			for (var i = count - 2; i >= 0; i--) {
				var part = parts[i];
				var index = ctx.$index();

				name = part + '[' + index + '].' + name;

				ctx = ctx.$parentContext;
			}
		}

		$elem = $(element);
		$elem.attr({ 'data-valmsg-for': name, 'data-valmsg-replace': true });

		var modelStateProperty = bindings.modelState;

		// Insert initial error message
		var modelState = bindingContext.$root[modelStateProperty];
		if (modelState && modelState[name] && modelState[name].Errors.length) {
			$elem.text(modelState[name].Errors[0].ErrorMessage);
			$elem.addClass("field-validation-error");
		}
		else {
			$elem.addClass("field-validation-valid")
		}
	},
};

