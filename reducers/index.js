const winston = require('winston');
const { ADD_WORDPRESS_CONFIG, ADD_WORDPRESS_COMMANDS } = require('../actions');
const yargs = require('@devly/devly-cli');
const WordPress = require('../scripts/wordpress');
const wordPress = new WordPress();
const initialState = {};
winston.cli();

function addWordPressConfig(state, config){
  return {...state, ...config};
}

function addWordPressCommands(state){
  yargs.command('wordpress init','Initialize mysql',
    {
      force: {
        alias: 'f',
        default: false,
      },
    },
    function handler(argv) {
      winston.log('info','Initializing Proxy Server!');
      wordPress.init(argv.force);
    }
  ).command('wordpress run', 'Run dev server!',
    {},
    function handler(argv) {
      winston.log('info', 'Running dev server');
      wordPress.run();
    });
  return state;
}


module.exports = function apacheReducer(state = initialState, action){
  switch (action.type) {
    case ADD_WORDPRESS_CONFIG:
      return addWordPressConfig(state, action.config);
    case ADD_WORDPRESS_COMMANDS:
      return addWordPressCommands(state);
    default:
      return state;
  }
}
