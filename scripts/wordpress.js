const fs = require('fs');
const winston = require('winston');
const { spawnSync } = require('child_process');
const { store }= require('@devly/devly-store');
const readline = require('readline');
const Database = require('./database');

function connectToDB(host){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  let con;

  return new Promise((resolve, reject)=>{
    rl.question('user:', (user) => {
      rl.question('password:', (password)=>{
        db = new Database({
          host,
          user,
          password
        });
        rl.close();
        resolve(db);
      });
    });
  })
}

function initDatabase(db, databaseName, wordpressUsername, hostname){
    const createDatabaseQuery = `CREATE DATABASE ${databaseName}`;
    const grantPrivilegesOnDatabaseQuery = `GRANT ALL PRIVILEGES ON ${databaseName}.* TO "${wordpressUsername}"@"${hostname}" IDENTIFIED WITH mysql_native_password BY "Summer99-mysql"`;
    const flushPrivilegesQuery = 'FLUSH PRIVILEGES';
    db.query(createDatabaseQuery)
      .then( result => {
        winston.log('info', "Database created!");
        return db.query(grantPrivilegesOnDatabaseQuery);
      })
      .then( result => {
        winston.log('info', 'Granted privileges!');
        return db.query(flushPrivilegesQuery);
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
  console.log('projectPath: ', projectPath);
  spawnSync(`cd ${projectPath} && php -S localhost:${port}`,[],{
    stdio: 'inherit',
    shell: true
  });
}

module.exports = class WordPress {
  init(force) {
    const { host, databaseName, wordpressUsername, hostname } = store.getState().wordpress;
    connectToDB(host).then((db)=>{
      initDatabase(db, databaseName, wordpressUsername, hostname);
    });
  }
  run(){
    const { projectPath, port } = store.getState().wordpress;
    runWordPress(projectPath, port);
  }
};
