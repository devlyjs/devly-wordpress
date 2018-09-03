# Introduction

Apache plugin for `@devly` cli manager built with redux and yargs.

# Installation

To add devly-apache plugin to your project, first make sure your project is set-up to consume Devly plugins (see https://github.com/aorinevo/devly-example#introduction).


Next, install `@devly/devly-apache`:

```bash
npm i @devly/devly-apache
```

# Install Dependencies

 - `brew install mysql`
 - start mysql: `mysql.server start`
 - secure mysql: `sudo mysql_secure_installation`
 - clone wordpress: `git clone https://github.com/WordPress/WordPress.git`

# Integration

Use `addApacheConfig` action creator to update the apache state in the devly-store.  It is recommended to place the initialState for apache in a `manifests/apache.js` file and requiring that file within the file that dispatches the action.

```js
// mainfests/apache.js

module.exports = {
  databaseName: 'wordpress',
  wordpressUsername: 'wordpress',
  port: 8080,
  hostname: 'localhost',
  projectPath: '/User/aorinevo/Repositories/WordPress'
};
```

It is recommended that the consumer create a `plugins/index.js` barrel file for the devly plugins it consumes.

```js
// plugins/index.js

require('./apache.js');

// plugins/apache.js
const {store} = require('@devly/devly-store');
const {addApacheConfig, addApacheCommands} = require('@devly/devly-apache/actions');
const {dispatch} = store;

require('@devly/devly-apache');

dispatch(addApacheConfig(require('./manifests/apache')));

dispatch(addApacheCommands());
```
