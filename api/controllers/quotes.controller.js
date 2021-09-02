const keys = require('./../config')
const db = require('../config/dataBaseConnection')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

module.exports.getQuotes = async (req, res) => {
  res.json("GET")
}

const parseTime = (stringTime) =>{
  return Number(stringTime.slice(0, -3).replace(":",""))
}

const comparisonTime = (current, open, close) =>{ 
  return parseTime(current) > parseTime(open) && parseTime(current) < parseTime(close)
}

const writeQuotesToDB = async (name, price, time) => { 
  await db.query("CREATE TABLE IF NOT EXISTS `"+ name + "`  ( `id` INT NOT NULL AUTO_INCREMENT , `price` INT NOT NULL , `date` VARCHAR(255) NOT NULL , `time` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;") 
     
  await db.query('INSERT INTO `'+ name + '` SET ?', { 
    price : price,
    date : Math.floor(Date.now() / 1000),
    time : time
  })
}

module.exports.addQuotes = async (req, res) => {
  try {
    if (req.body.quotes && Array.isArray(req.body.quotes) && req.body.quotes.length > 0) {

      const currentMinTime = new Date().getMinutes()
      const dateTime = new Date()
      const currentTime = dateTime.getHours() + ":" + (dateTime.getMinutes()<10?'0':'') + dateTime.getMinutes() + ":00"

      const quotes = await db.execute('SELECT alias, open, close  FROM `quotes_config`')

      req.body.quotes.forEach(function (quote, i, arr) {

        let findQuotes = quotes[0].find(el => el.alias == quote.alias)

        if (findQuotes) {
          if (comparisonTime(currentTime, findQuotes.open, findQuotes.close)) {
            writeQuotesToDB(quote.alias, quote.price, currentMinTime)
          }
        }  
      }); 

      res.json({
        message : "successful addition",
      }) 

    } else {
      res.status(409).json({ message: "Не передано quotes | Передан не массив или он пустой" })
    }
  } catch (err) {
    log.Fatal('Добавление значений(quotes)', 'quotes', 'addQuotes', err.toString());
    res.status(409).json({ message: 'Ошибка при добавлении значений(quotes)' })
  }
}