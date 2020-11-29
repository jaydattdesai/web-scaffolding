
var express = require('express')
const bodyParser = require('body-parser')
const router = require('./routes.js')

var app = express()

app.use(bodyParser.json())
router.routeConfig(app)

var server = app.listen(8090)