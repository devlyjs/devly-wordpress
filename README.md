# Introduction

WordPress plugin for `@devly`.

# Installation

To add devly-wordpress plugin to your project, first make sure your project is set-up to consume Devly plugins (see https://github.com/aorinevo/devly-example#introduction).


Next, install `@devly/devly-wordpress`:

```bash
npm i @devly/devly-wordpress
```

# Install Dependencies

 - `brew install mysql@5.7`
 - start mysql: `mysql.server start`
 - secure mysql: `mysql_secure_installation`
 - clone wordpress: `git clone https://github.com/WordPress/WordPress.git`

# Integration

Use `addWordPressConfig` action creator to update the wordpress state in the devly-store.  It is recommended to place the initialState for wordpress in a `manifests/wordpress.js` file and requiring that file within the file that dispatches the action.

```js
// mainfests/wordpress.js

module.exports = {
  databaseName: 'wordpress',
  wordpressUsername: 'wordpress',
  port: 8080,
  hostname: 'localhost',
  projectPath: '/Users/aorinevo/Repositories/WordPress'
};
```

It is recommended that the consumer create a `plugins/index.js` barrel file for the devly plugins it consumes.

```js
// plugins/index.js

require('./wordpress.js');

// plugins/wordpress.js
const {store} = require('@devly/devly-store');
const {addWordPressConfig, addWordPressCommands} = require('@devly/devly-wordpress/actions');
const {dispatch} = store;

require('@devly/devly-wordpress');

dispatch(addWordPressConfig(require('./manifests/wordpress')));

dispatch(addWordPressCommands());
```
