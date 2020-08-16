// templates.text.js

templates.text = function(inputModifier) {
  return function() {
    var binding = {
      element: document.createElement('input'),
      setValue: function(v) {
        binding.element.value = v;
      },
      getValue: function() {
        return binding.element.value;
      },
      focus: function() {
        binding.element.focus();
      }
    };

    if (inputModifier != null) {
      inputModifier(binding.element);
    }

    return binding;
  };
};

templates.textWithLabel = function(label, inputModifier) {
  return function() {
    var binding = {
      element: document.createElement('span'),
      labelSpan: document.createElement('span'),
      inner: templates.text(inputModifier)(),
      focus: function() {
        binding.inner.focus();
      }
    };
    binding.setValue = binding.inner.setValue;
    binding.getValue = binding.inner.getValue;
    binding.labelSpan.innerText = label.toString() + ': ';
    binding.element.appendChild(binding.labelSpan);
    binding.element.appendChild(binding.inner.element);
    return binding;
  };
};
