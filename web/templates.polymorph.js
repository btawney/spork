// templates.polymorph.js

templates.polymorph = function(chooserName, formName, chooserTemplate, formTemplates) {
  return function() {
    var binding = {
      type: 'polymorph',
      element: document.createElement('div'),
      chooserBinding: chooserTemplate(),
      formBinding: null,
      setValue: function(v) {
        if (chooserName in v) {
          binding.chooserBinding.setValue(v[chooserName]);
          binding.setForm(v[chooserName]);
        }
        if (binding.formBinding != null && formName in v) {
          binding.formBinding.setValue(v[formName]);
        }
      },
      getValue: function() {
        var result = {};
        result[chooserName] = binding.chooserBinding.getValue();
        if (binding.formBinding != null) {
          result[formName] = binding.formBinding.getValue();
        }
        return result;
      },
      setForm: function() {
        var chooser = binding.chooserBinding.getValue();

        if (binding.formBinding != null) {
          binding.element.removeChild(binding.formBinding.element);
        }

        if (chooser in formTemplates) {
          var newBinding = formTemplates[chooser]();
          binding.formBinding = newBinding;
          binding.element.appendChild(newBinding.element);
        } else {
          binding.formBinding = null;
        }
      },
      focus: function() {
        if (binding.formBinding != null && ('focus' in binding.formBinding)) {
          binding.formBinding.focus();
        }
      }
    };

    binding.element.appendChild(binding.chooserBinding.element);
    if (binding.formBinding != null) {
      binding.element.appendChild(binding.formBinding.element);
    }

    binding.chooserBinding.onChange = binding.setForm;

    return binding;
  };
};
