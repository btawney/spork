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

templates.transformText = function(t) {
  var colon = t.indexOf(':');
  if (colon >= 0) {
    var textToUse = t.substr(colon + 1);
  } else {
    var textToUse = t;
  }
  return textToUse;
};

templates.entryReadOnly = function() {
  return function() {
    var binding = {
      element: document.createElement('DIV'),
      original: null,
      setValue: function(v) {
        var html = '';

        if ('lemmas' in v) {
          for (var i = 0; i < v.lemmas.length; ++i) {
            var textToUse = templates.transformText(v.lemmas[i]);
            html += (i > 0 ? ', ' : '') + '<b>' + textToUse + '</b>';
          }
        }

        if ('paradigm' in v) {
          html += ' (<i>' + v.paradigm.partOfSpeech + '</i>)';
        }

        if ('definitions' in v) {
          if (v.definitions.length > 1) {
            for (var i = 0; i < v.definitions.length; ++i) {
              var def = v.definitions[i];
              html += ' <b>' + (i + 1).toString() + '</b>. ' + def.definition + ';';

              for (var j = 0; j < def.usages.length; ++j) {
                html += ' ' + (i + 1).toString() + '.' + (j + 1).toString() + ' <i>' + def.usages[j].formula + '</i>, ' + def.usages[j].reading + ';';
              }
            }
          } else if (v.definitions.length == 1) {
            var def = v.definitions[0];
            html += ' ' + def.definition;
          }
        }

        if ('paradigm' in v) {
          for (var code in v.paradigm.paradigm) {
            if (v.paradigm.paradigm[code].length > 0) {
              html += '; <b>' + code + '</b>';
              var first = true;
              for (var i = 0; i < v.paradigm.paradigm[code].length; ++i) {
                if (first) {
                  html += ': ';
                  first = false;
                } else {
                  html += ', ';
                }

                html += templates.transformText(v.paradigm.paradigm[code][i]);
              }
            }
          }
        }

        binding.element.innerHTML = html;
      },
      getValue: function() {
        return binding.original;
      }
    };

    return binding;
  };
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

