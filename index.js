const {reducerRegistry} = require('@devly/devly-store');

reducerRegistry.register('wordpress', require('./reducers'));
