// data.lexicon.js

data.lexicon = {
  newEntry: function() {
    var defaultScheme = data.setting.value('defaults').defaultTransformationScheme;
    var defaultPartOfSpeech = data.setting.value('defaults').defaultPartOfSpeech;
    return {
      lemmas: [ defaultScheme + ':'  ],
      paradigm: { partOfSpeech: defaultPartOfSpeech, paradigm: {}},
      definitions: [ { definition: '', usages: [] } ]
    };
  }
};
