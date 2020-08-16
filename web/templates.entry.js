// templates.entry.js

templates.entry = function() {
  return templates.roster([
    {name: 'lemmas', label: 'Lemmas', template: templates.list(templates.text(templates.transformable.wholeFieldModifier))},
    {name: 'paradigm', label: 'Paradigm', template: templates.entryParadigm()},
    {name: 'definitions', label: 'Definitions', template: templates.table([
      {name: 'definition', label: 'Definition', template: templates.text()},
      {name: 'usages', label: 'Usages', template: templates.table([
        {name: 'formula', label: 'Formula', template: templates.text(templates.transformable.wholeFieldModifier)},
        {name: 'reading', label: 'Reading', template: templates.text()}
        ])}
      ])}
  ]);
};

templates.entryParadigm = function() {
  return function() {
    var partsOfSpeech = data.setting.value('partsOfSpeech');
    var selectArray = {};
    var rosterDefinition = {};

    for (var i = 0; i < partsOfSpeech.length; ++i) {
      var partOfSpeech = partsOfSpeech[i];
      selectArray[partOfSpeech.code] = partOfSpeech.detail.label;
      rosterDefinition[partOfSpeech.code] = [];

      for (var j = 0; j < partOfSpeech.detail.inflections.length; ++j) {
        var inflection = partOfSpeech.detail.inflections[j];
        rosterDefinition[partOfSpeech.code].push({
          name: inflection.code,
          label: inflection.label,
          template: templates.list(templates.text(templates.transformable.wholeFieldModifier))
        });
      }
    }

    var rosterTemplates = {};
    for (var pos in rosterDefinition) {
      rosterTemplates[pos] = templates.roster(rosterDefinition[pos]);
    }

    return templates.polymorph('partOfSpeech', 'paradigm',
      templates.select(selectArray),
      rosterTemplates)();
  };
};

