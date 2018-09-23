const fs = require('fs');
const winston = require('winston');
const { spawnSync } = require('child_process');
const { store }= require('@devly/devly-store');
const prompt = require('prompt');
const Database = require('./database');

let db = null;

function connectToDB(host){
  const schema = {
    properties: {
      user: {
        required: true
      },
      password: {
        hidden: true,
        replace: '*'
      }
    }
  };
  return new Promise((resolve, reject)=>{
    prompt.start();
    prompt.get(schema, function (err, result) {
      db = new Database({
        host,
        user: result.user,
        password: result.password
      });
      resolve(db);
    });
  })
}

function getDBPassword(databaseName, wordpressUsername, hostname){
  const schema = {
    properties: {
      password: {
        description: 'Enter password for wordpress user',
        hidden: true,
        replace: '*'
      }
    }
  };
  return new Promise((resolve, reject)=>{
      prompt.get(schema, (err, result)=>{
        resolve(`GRANT ALL PRIVILEGES ON ${databaseName}.* TO "${wordpressUsername}"@"${hostname}" IDENTIFIED BY "${result.password}"`);
      });
  });
}

function initDatabase(databaseName, wordpressUsername, hostname, host){
    connectToDB(host)
      .then( result =>{
        return db.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
      })
      .then( result => {
        return getDBPassword(databaseName, wordpressUsername, hostname);
      })
      .then( result => {
        winston.log('info', "Database created!");
        return db.query(result);
      })
      .then( result => {
        winston.log('info', 'Granted privileges!');
        return db.query('FLUSH PRIVILEGES');
      })
      .then( result => {
        winston.log('info', 'Flushed privileges!');
        return db.close();
      }).catch( err => {
        db.close();
        winston.log('error', err);
      })
}

function runWordPress(projectPath, port){
  spawnSync(`cd ${projectPath} && php -S localhost:${port}`,[],{
    stdio: 'inherit',
    shell: true
  });
}

module.exports = class WordPress {
  init(force) {
    const { host, databaseName, wordpressUsername, hostname } = store.getState().wordpress;
    initDatabase(databaseName, wordpressUsername, hostname, host);
  }
  run(){
    const { projectPath, port } = store.getState().wordpress;
    runWordPress(projectPath, port);
  }
};
