# spork

This is an experimental framework based on the idea of designing the user interface first, then letting the user interface define the data structure. I built it primarily so I could quickly make apps to record human language lexical data.

The user interface is coded in JavaScript, and data is ultimately stored in MySql, but data is stored and accessed in an unstructured way that essentially makes this a NoSql solution.

## Bindings

The basic building block of a user interface is a "binding", which has three essential components:
* element: a DOM element that can be inserted into a page
* setValue(v): a function that can be used to set the value of the element
* getValue(): a function that can be used to return the value of the element

An example of a binding would be a table with fillable cells. The element member is probably a <table> element, the setValue function takes an array of objects to display in the table, and the getValue function returns an array of objects.

## Templates

A "template" is a function that takes no parameters and returns a binding. This would be like the definition of a table, rather than the actual table itself.

## Template Factories

A "template factory" is a function that normally takes some parameters and returns a template. This would be like the generic idea of a table.

For example, `templates.table` is an example of a template factory. You can use it to define a table template as follows:

```javascript
var tableTemplate = templates.table([
  {name: 'key', label: 'Key', templates.textReadOnly()},
  {name: 'partOfSpeech', label: 'Part of Speech', templates.textReadOnly()},
]);
```

The table template uses other templates to decide how to represent the data in the table. In this case, both columns are being represented as read-only text.

To create an instance of the table and populate it with data, do this:

```javascript
var tableBinding = tableTemplate();
tableBinding.setValue([
  {key: '29hhj', partOfSpeech: 'n'},
  {key: 'kfn5e', partOfSpeech: 'v'}
]);
document.body.appendChild(tableBinding.element);
```
