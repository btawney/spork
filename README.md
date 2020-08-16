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

## Records

A "record" is a JavaScript object returned by the `getValue()` method of a binding. These are serialized using JSON and stored exactly as-is in the database, to be retrieved later and sent into the `setValue()` method. The only constraint enforced on records is that, once written to the database, they are assigned an attribute called "key" that will uniquely identify them. Keys are assigned randomly in order to make it relatively difficult to guess them.

When a record is revised, the old version of the record is not overwritten. Instead the data layer creates a new revision of the record and maintains it alongside the old one, with a date/time stamp to indicate when the new version was written. Deletes are also treated as a revision to a record.

## Collections

A "collection" is an unordered set records. There is nothing in the data layer that enforces a similarity of structure on records in a collection. That is all handled in the user interface. Collections also have a key value that uniquely identifies them.

## Apps

An "app" is a universe of collections. All of the data for an app is loaded into browser memory when the app starts up. Writes back to the data layer happen asynchronously as the user changes the data, making user the user interface extremely quick to respond.
