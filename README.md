# json-schema-editor

> An intuitive editor for json schema which provides a tree view to present structure of schema and a property inspector to edit the properties of schema element. 
> Develop with Vue.js 2 and Firebase. Please reference the [project website](https://json-schema-editor.tangramjs.com) for detail.

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
This project requires valid Firebase configuration to function properly, replace config in `\src\firebase\index.js` with your Firebase config:
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
