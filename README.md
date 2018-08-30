# json-schema-editor

> An intuitive editor for JSON schema which provides a tree view to present structure of schema and a property inspector to edit the properties of schema element. 
> Develop with Vue.js 2 and Firebase. Please reference the [project website](https://json-schema-editor.tangramjs.com) for detail.

## Features
#### Pallet of schema elements
List of all elements of JSON schema, could drag and drop to tree view.
#### Pallet of user schemas
List of all user schemas, which are stored in Firebase. User could save, load, delete and import schemas, schema could drag and drop to tree view.
#### Tree View of schema elements
The structure of schema, could expend or collapse at any level.
#### Context Menu
Right-click on the element in tree view could bring out the context menu for that element, and perform actions specific for that element.
#### Property Inspector of schema elements
A panel to edit properties of schema element.
#### Text View of schema
A text view to display content of schema.
#### Drag and Drop
The element of JSON schema could drag and drop from pallet to tree view or within tree view.
#### Undo/Redo
Undo and Redo could keep track of every update of schema.
#### Schema Repository
User could save/load schemas to/from Firebase repository, import schema from file.

## Install
``` bash
git clone https://github.com/tangram-js/json-schema-editor.git
```
## Build

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
## About Firebase Configuration
This project requires a valid Firebase configuration to function properly, please replace config in `/src/firebase/index.js` with your Firebase config:
 ``` js
 // Initialize firebase
 // Replace following config with your Firebase config
 var config = {
   apiKey: 'your firebase api key',
   authDomain: 'your firebase auth domain',
   databaseURL: 'your firebase database url',
   projectId: 'your firebase project id',
   storageBucket: 'your firebase storage bucket',
   messagingSenderId: 'your firebase message sender id'
 }
 ```
## About JSON Editor
[JSON Editor](https://github.com/tangram-js/json-editor) is successor of JSON Schema Editor, which is a schema-aware editor for JSON document including JSON schema. It provides a tree view to present the structure of JSON document, user could manipulate the JSON from context menu. There is a text view to present the content of JSON document, user may edit JSON within. They share user accounts and user schema repository, so user could use one account to login both editors and access schemas.
