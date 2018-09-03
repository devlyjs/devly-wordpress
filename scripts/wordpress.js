const fs = require('fs');
const winston = require('winston');
const { spawnSync } = require('child_process');
const mysql = require('mysql');
const { store }= require('@devly/devly-store');
const readline = require('readline');

function connectToDB(host){
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const con = null;

  rl.question('user:', (user) => {
    rl.question('password:', (password)=>{
      con = mysql.createConnection({
        host,
        user,
        password
      });
      rl.close();
    });
  });

  return con;
}

function createDatabase(con, databaseName){
  con.connect(function(err) {
    if (err) throw err;
    winston.log('info', "Creating Database...");
    con.query(`CREATE DATABASE ${databaseName}`, function (err, result) {
      if (err) throw err;
      winston.log('info', "Database created");
    });
  });
}

function grantPrivilegesOnDatabase(con, databaseName, wordpressUsername) {
  con.connect(function(err) {
    if (err) throw err;
    winston.log('info', "Granting privileges...");
    con.query(`GRANT ALL PRIVILEGES ON ${databaseName}.* TO "${wordpressUsername}"@"${hostname}" IDENTIFIED BY "${password}"`, function (err, result) {
      if (err) throw err;
      winston.log('info', "Granted privileges!");
    });
  });
}

function flushPrivileges(con){
  con.connect(function(err) {
    if (err) throw err;
    winston.log('info', "Flushing privileges...");
    con.query(`FLUSH PRIVILEGES`, function (err, result) {
      if (err) throw err;
      winston.log('info', "Flushed privileges!");
    });

    con.query(`EXIT`, function (err, result) {
      if (err) throw err;
      winston.log('info', "Exited mysql!");
    });
  });
}

function runWordPress(projectPath, port){
  spawnSync(`cd ${projectPath} && php -S localhost:${port}`,[],{
    stdio: 'inherit'
  });
}

module.exports = class WordPress {
  init(force) {
    const { host, databaseName } = store.getState().wordpress;
    this.con = connectToDB;
    createDatabase(this.con, databaseName);
    grantPrivilegesOnDatabase(this.con, databaseName, wordpressUsername);
    flushPrivileges(this.con);
  }
  run(){
    const { projectPath, port } = store.getState().wordpress;
    runWordPress(projectPath, port);
  }
};
