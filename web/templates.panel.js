// templates.panel.js

templates.panel = function(elementTemplates) {
  return function() {
    var binding = {
      type: 'panel',
      element: document.createElement('div'),
      model: {},
      setValue: function(elementValues) {
        for (var name in binding.model) {
          if (name in elementValues) {
            binding.model[name].setValue(elementValues[name]);
          }
        }
      },
      getValue: function() {
        var result = {};
        for (var name in binding.model) {
          result[name] = binding.model[name].getValue();
        }
        return result;
      }
    };

    for (var name in elementTemplates) {
      binding.model[name] = elementTemplates[name]();
      binding.element.appendChild(binding.model[name].element);
    }

    return binding;
  };
};
