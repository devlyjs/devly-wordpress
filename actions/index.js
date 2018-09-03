// Use higher order reducers here

const ADD_WORDPRESS_CONFIG = 'ADD_WORDPRESS_CONFIG';
const ADD_WORDPRESS_COMMANDS = 'ADD_WORDPRESS_COMMANDS';

function addWordPressConfig (config) {
  return {
    type: ADD_WORDPRESS_CONFIG,
    config
  }
}

function addWordPressCommands (yargs) {
  return {
    type: ADD_WORDPRESS_COMMANDS,
    yargs
  }
}


module.exports = {
  addWordPressConfig,
  addWordPressCommands,
  ADD_WORDPRESS_CONFIG,
  ADD_WORDPRESS_COMMANDS
}
