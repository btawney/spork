// forms.settings.js

templates.settingTable = function(settingName) {
  return function() {
    var binding = templates.panel({
      table: templates.table([
        {name: 'label', label: 'Label', template: templates.text()},
        {name: 'value', label: 'Value', template: templates.text()}
      ]),
      saveCancelPanel: templates.buttons.saveCancelPanel()
    })();

    binding.model.saveCancelPanel.onSave = function() {
      data.setting.update(settingName, binding.model.table.getValue());
    };

    binding.model.saveCancelPanel.onCancel = function() {
      binding.model.table.setValue(data.setting.value(settingName, []));
    };

    binding.model.table.setValue(data.setting.value(settingName, []));

    return binding;
  };
};

templates.settingRoster = function(settingName, columns) {
  return function() {
    var binding = templates.panel({
      roster: templates.roster(columns),
      saveCancelPanel: templates.buttons.saveCancelPanel()
    })();

    binding.model.saveCancelPanel.onSave = function() {
      data.setting.update(settingName, binding.model.roster.getValue());
    };

    binding.model.saveCancelPanel.onCancel = function() {
      binding.model.table.setValue(data.setting.value(settingName, []));
    };

    binding.model.roster.setValue(data.setting.value(settingName, []));

    return binding;
  };
};

templates.partsOfSpeechTable = function() {
  return function() {
    var binding = templates.panel({
      table: templates.table([
        {name: 'code', label: 'Code', template: templates.text()},
        {name: 'detail', label: 'Details', template: templates.roster([
          {name: 'label', label: 'Label', template: templates.text()},
          {name: 'inflections', label: 'Inflections', template: templates.table([
            {name: 'code', label: 'Code', template: templates.text()},
            {name: 'label', label: 'Label', template: templates.text()}
])}
        ])}
      ]),
      saveCancelPanel: templates.buttons.saveCancelPanel()
    })();

    binding.model.saveCancelPanel.onSave = function() {
      data.setting.update('partsOfSpeech', binding.model.table.getValue());
    };

    binding.model.saveCancelPanel.onCancel = function() {
      binding.model.table.setValue(data.setting.value('partsOfSpeech', []));
    };

    binding.model.table.setValue(data.setting.value('partsOfSpeech', []));

    return binding;
  };
};

templates.inputTransformationTable = function() {
  return function() {
    var binding = templates.panel({
      table: templates.table([
        {name: 'code', label: 'Code', template: templates.text()},
        {name: 'detail', label: 'Details', template: templates.roster([
          {name: 'label', label: 'Label', template: templates.text()},
          {name: 'transformations', label: 'Transformations', template: templates.table([
            {name: 'inputSequence', label: 'Input Sequence', template: templates.text()},
            {name: 'outputSequence', label: 'Output Sequence', template: templates.text()}
])}
        ])}
      ]),
      saveCancelPanel: templates.buttons.saveCancelPanel()
    })();

    binding.model.saveCancelPanel.onSave = function() {
      data.setting.update('inputTransformations', binding.model.table.getValue());
    };

    binding.model.saveCancelPanel.onCancel = function() {
      binding.model.table.setValue(data.setting.value('inputTransformations', []));
    };

    binding.model.table.setValue(data.setting.value('inputTransformations', []));

    return binding;
  };
};

forms.settings = {
  template: templates.roster([
    {name: 'defaults', label: 'Defaults',
      template: templates.settingRoster('defaults', [
        {name: 'defaultTransformationScheme',
         label: 'Default Transformation Scheme',
         template: templates.text()},
        {name: 'defaultPartOfSpeech',
         label: 'Default Part of Speech',
         template: templates.text()}
      ])},
    {name: 'partsOfSpeech', label: 'Parts of Speech',
      template: templates.partsOfSpeechTable()},
    {name: 'inputTransformations', label: 'Input Transformations',
      template: templates.inputTransformationTable()}
  ]),
  binding: null,
  show: function() {
    if (forms.settings.binding == null) {
      forms.settings.binding = forms.settings.template();
    }
    ui.clear();
    ui.add(forms.settings.binding.element);
  },
};

ui.registerRoute('settings', forms.settings.show);
ui.registerMenuItem('Settings', 'settings');

