// forms.new.js

forms.new = {
  template: templates.panel({
    entry: templates.entry(),
    saveCancelPanel: templates.buttons.saveCancelPanel()
  }),
  binding: null,
  show: function() {
    if (forms.new.binding == null) {
      forms.new.binding = forms.new.template();

      forms.new.binding.model.saveCancelPanel.onSave = function(evt) {
        data.tables.lexicon.update(forms.new.binding.model.entry.getValue());
        forms.new.binding.model.entry.setValue(data.lexicon.newEntry());
      };

      forms.new.binding.model.saveCancelPanel.onCancel = function(evt) {
        forms.new.binding.model.entry.setValue(data.lexicon.newEntry());
      };
    }
    ui.clear();
    ui.add(forms.new.binding.element);
  },
};

ui.registerRoute('new', forms.new.show);
ui.registerMenuItem('New', 'new');

