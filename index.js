require("dotenv").config();

var bot = require('./src/bot.js');
require('./web')(bot);
