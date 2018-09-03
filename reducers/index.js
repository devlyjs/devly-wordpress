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
  yargs.command('wordpress [command]','Value of command should be init or run',
    {
      force: {
        alias: 'f',
        default: false,
      },
    },
    function (argv) {
      switch( argv.command ){
        case 'init':
          winston.log('info','Initializing Proxy Server!');
          wordPress.init(argv.force);
          break;
        case 'run':
          winston.log('info','Running wordpress dev server!');
          wordPress.run();
          break;
        default:
          winston.log('info','Running wordpress dev server!');
          wordPress.run();
      }
    }
  ).choices('command', ['init','run']);
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
