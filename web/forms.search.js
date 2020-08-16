// forms.search.js

forms.search = {
  element: document.createElement('div'),
  term: templates.textWithLabel('Term')(),
  resultsArea: document.createElement('div'),
  show: function() {
    ui.clear();
    ui.add(forms.search.element);
  }
};

forms.search.element.appendChild(forms.search.term.element);
forms.search.element.appendChild(document.createElement('hr'));
forms.search.element.appendChild(forms.search.resultsArea);

ui.registerRoute('search', forms.search.show);
ui.registerMenuItem('Search', 'search');
