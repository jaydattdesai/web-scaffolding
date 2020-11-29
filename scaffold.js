const { UV_FS_O_FILEMAP } = require('constants');
var fs = require('fs');
const { request } = require('http');

var dbname = 'sample'
var entityName = "User";
var entityDefinition = "email: Sequelize.STRING,firstname: Sequelize.STRING,lastname: Sequelize.STRING"

fs.copyFile('./scaffold_files/app.js.base','app.js', err => {
    if(err) {
        console.log("error creating app.js file", err)
    }
})

if(!fs.existsSync('./config')) {
    fs.mkdir('./config', err => {
        if(err){
            console.log("error creating config directory")
            }
        })
    }
fs.copyFile('./scaffold_files/dbconfig.js.base','./config/dbconfig.js', err => {
    if(err) {
        console.log("error creating dbconfig.js file", err)
    }
    fs.appendFile('./config/dbconfig.js', "global."+entityName+" = sequelize.define('"+entityName+"', {"+entityDefinition+"});", appednErr => {
        if(appednErr){
            console.log("error appending "+entityName+" data in dbconfig.js")
        }
    })
})

fs.copyFile('./scaffold_files/db.config.js.base','./config/db.config.js', err => {
    if(err) {
        console.log("error creating db.config.js file", err)
    }
    // fs.repl
})

fs.readFile('./scaffold_files/db.config.js.base', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace("<dbname>", dbname);
  
    fs.writeFile('./config/db.config.js', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
  
  fs.readFile('./scaffold_files/routes.js.base', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/<entity>/g, entityName);
  
    fs.writeFile('routes.js', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

  if(!fs.existsSync('./controller')) {
    fs.mkdir('./controller', err => {
        if(err){
            console.log("error creating controller directory")
            }
        })
    }
  fs.readFile('./scaffold_files/Controller.js.base', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/<entity>/g, entityName);
  
    fs.writeFile('./controller/'+entityName+'Controller.js', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });

  if(!fs.existsSync('./service')) {
    fs.mkdir('./service', err => {
        if(err){
            console.log("error creating service directory")
            }
        })
    }
  fs.readFile('./scaffold_files/Service.js.base', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var entityColumns  = entityDefinition.split(",")
    var requestdata = "";
    entityColumns.forEach(column => {
        column = column.split(":")[0];
        column += ": request.body."+column+","
        requestdata += column
    })

    var result = data.replace(/<entity>/g, entityName).replace('<requestdata>', requestdata);

  
    fs.writeFile('./service/'+entityName+'Service.js', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });