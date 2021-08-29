const keys = require('./../config')
const db = require('../config/dataBaseConnection')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

module.exports.getQuotes = async (req, res) => {
    res.json("GET")
} 

module.exports.addQuotes = async (req, res) => {
    res.json("ADD")
}