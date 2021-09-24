const keys = require('./../config')
const db = require('../config/dataBaseConnection')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

const loadChartData = async (body, res) =>{
  if(body.alias && body.period) {
    let quotes

    let quote_config = await db.query('SELECT * FROM `quotes_config` WHERE alias = ? ', [body.alias])

    if(body.date && body.date.start){ 
      if((new Date(body.date.start)).getTime() > 0){
        quotes = await db.query('SELECT price, date FROM `'+ body.alias +'` WHERE date >= ? AND time % ? = 0', [body.date.start, body.period])
      } else {
        res.status(409).json({ message: "Невалидный date -> start" })
      }  
    } else {
      let now = new Date();
      // let startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      let startOfDay = new Date(now.getFullYear(), now.getMonth(), 23);
      let timestamp = startOfDay / 1000; 

      quotes = await db.query('SELECT price, date FROM `'+ body.alias +'` WHERE date >= ? AND `time` % ? = 0', [timestamp, body.period])
    } 

    res.json({
      message : "successful",
      data : quotes[0],
      q_config  : quote_config[0][0]
    })
  } else {
    res.status(409).json({ message: "Не передано alias, period" })
  }
}

const loadChartListData = async (body, res) =>{
  if(body.aliases && body.aliases.length > 0) {
    
    let quoteList = []
    let quote
    let sqlConfigString = ''  

    for (alias in body.aliases) { 
      sqlConfigString +=  `'${body.aliases[alias]}',`
    }

    let quote_config = await db.query('SELECT * FROM `quotes_config`  WHERE `alias` IN (' + sqlConfigString.slice(0, -1)  + ')')  

    for (alias in body.aliases) { 
      quote = await db.query('SELECT * FROM `'+ body.aliases[alias] +'` ORDER BY id DESC LIMIT 1')

      let configOneQuote = quote_config[0].find(element => element.alias === body.aliases[alias])

      quoteList.push({
        alias : body.aliases[alias],
        price : quote[0][0].price,
        date : quote[0][0].date,
        change : quote[0][0].change,
        change_p : quote[0][0].change_p,
        name : configOneQuote.name,
        open : configOneQuote.open,
        close : configOneQuote.close
      }); 
    }  

    res.json({
      message : "successful",
      data : quoteList
    })
  } else {
    res.status(409).json({ message: "Не передано aliases" })
  }
}

const loadListData = async (body, res) =>{
  if(body.aliases && body.aliases.length > 0) {
    
    let quoteList = []
    let quote
    let sqlConfigString = ''  

    for (alias in body.aliases) { 
      sqlConfigString +=  `'${body.aliases[alias]}',`
    }

    let quote_config = await db.query('SELECT * FROM `quotes_config`  WHERE `alias` IN (' + sqlConfigString.slice(0, -1)  + ')')  

    for (alias in body.aliases) { 
      quote = await db.query('SELECT * FROM `'+ body.aliases[alias] +'` ORDER BY id DESC LIMIT 1')

      let configOneQuote = quote_config[0].find(element => element.alias === body.aliases[alias])

      quoteList.push({
        alias : body.aliases[alias],
        price : quote[0][0].price,
        date : quote[0][0].date,
        change : quote[0][0].change,
        change_p : quote[0][0].change_p,
        name : configOneQuote.name,
        open : configOneQuote.open,
        close : configOneQuote.close
      }); 
    }  

    res.json({
      message : "successful",
      data : quoteList
    })
  } else {
    res.status(409).json({ message: "Не передано aliases" })
  }
}

const loadMarqueeData = async (body, res) =>{
  if(body.aliases && body.aliases.length > 0) {
    
    let quoteList = []
    let quote
    let sqlConfigString = ''  

    for (alias in body.aliases) { 
      sqlConfigString +=  `'${body.aliases[alias]}',`
    }

    let quote_config = await db.query('SELECT * FROM `quotes_config`  WHERE `alias` IN (' + sqlConfigString.slice(0, -1)  + ')')  

    for (alias in body.aliases) { 
      quote = await db.query('SELECT * FROM `'+ body.aliases[alias] +'` ORDER BY id DESC LIMIT 1')

      let configOneQuote = quote_config[0].find(element => element.alias === body.aliases[alias])

      quoteList.push({
        alias : body.aliases[alias],
        price : quote[0][0].price,
        date : quote[0][0].date,
        change : quote[0][0].change,
        change_p : quote[0][0].change_p,
        name : configOneQuote.name,
        open : configOneQuote.open,
        close : configOneQuote.close
      }); 
    }  

    res.json({
      message : "successful",
      data : quoteList
    })
  } else {
    res.status(409).json({ message: "Не передано aliases" })
  }
}

const loadPointData = async (body, res) => {
  if(body.alias) {  
    let quote = await db.query('SELECT price, date FROM `'+ body.alias +'` ORDER BY id DESC LIMIT 1')
 
    res.json({
      message : "successful",
      point : quote[0][0]
    })
  } else {
    res.status(409).json({ message: "Не передано alias" })
  }
}

module.exports.getQuotes = async (req, res) => {
  try {

    switch (req.body.type) {
      case 'chart':
        await loadChartData(req.body, res) 
        break;
      case 'chart-list':
        await loadChartListData(req.body, res) 
        break;
      case 'list':
        await loadListData(req.body, res) 
        break;
      case 'loadPoint':
        await loadPointData(req.body, res) 
        break; 
      case 'marquee':
        await loadMarqueeData(req.body, res) 
        break; 
      default:
        res.status(404).json({ message: `Тип ${req.body.type} не найден` })
    } 

  } catch (err) {
    log.Fatal('Выгрузка значений(quotes)', 'quotes', 'getQuotes', err.toString());
    res.status(409).json({ message: 'Ошибка при выгрузке значений(quotes)' })
  }
}

const parseTime = (stringTime) =>{
  return Number(stringTime.slice(0, -3).replace(":",""))
}

const comparisonTime = (current, open, close) =>{ 
  return parseTime(current) > parseTime(open) && parseTime(current) < parseTime(close)
}

const writeQuotesToDB = async (name, price, change, change_p, time) => { 
  await db.query("CREATE TABLE IF NOT EXISTS `"+ name + "`  ( `id` INT NOT NULL AUTO_INCREMENT , `price` DOUBLE NOT NULL , `change` VARCHAR(255) NOT NULL, `change_p` VARCHAR(255) NOT NULL, `date` VARCHAR(255) NOT NULL , `time` INT NOT NULL , PRIMARY KEY (`id`)) ENGINE = InnoDB;") 
   
  await db.query('INSERT INTO `'+ name + '` SET ?', { 
    price : price.replace(",", ""),
    change : change,
    change_p : change_p,
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
            writeQuotesToDB(quote.alias, quote.price, quote.change, quote.change_p, currentMinTime)
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