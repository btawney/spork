// templates.buttons.js

templates.buttons = {
  generic: function(label) {
    var binding = templates.list
    return function() {
      var binding = {
        type: 'button',
        element: document.createElement('BUTTON'),
        onClick: function(evt) {
          console.log('Click not implemented');
        },
        savedValue: null,
        setValue: function(v) {
          binding.savedValue = v;
        },
        getValue: function() {
          return binding.savedValue;
        },
        focus: function() {
          binding.element.focus();
        }
      };

      binding.element.innerText = label;
      binding.element.addEventListener('click', function(evt) {
        binding.onClick(evt);
      });

      return binding;
    };
  },
  save: function() {
    return templates.buttons.generic('Save');
  },
  cancel: function() {
    return templates.buttons.generic('Cancel');
  },
  saveCancelPanel: function() {
    return function() {
      var binding = templates.panel({
        save: templates.buttons.save(),
        cancel: templates.buttons.cancel()
      })();

      binding.onSave = function(evt) {
        console.log('No save logic defined');
      };
      binding.model.save.onClick = function(evt) {
        binding.onSave(evt);
      };

      binding.onCancel = function(evt) {
        console.log('No cancel logic defined');
      };
      binding.model.cancel.onClick = function(evt) {
        binding.onCancel(evt);
      };

      return binding;
    };
  }
};
