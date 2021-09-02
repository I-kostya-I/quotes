const keys = require('./../config')
const db = require('../config/dataBaseConnection')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

module.exports.getConfig = async (req, res) => {
  try {
    if (req.query.type == 'links') {
      const links = await db.execute('SELECT * FROM `links`')

      res.json({
        message : "successful",
        links : links[0]
      }) 
    } 

    if (req.query.type == 'quotes') {
      const quotes = await db.execute('SELECT * FROM `quotes_config`')

      res.json({
        message : "successful",
        quotes : quotes[0]
      }) 
    } 
  } catch (err) {
    log.Fatal('Выгрузка ссылок', 'config/links', 'getLinks', err.toString());
    res.status(409).json({ message: 'Ошибка при выгрузке данных' })
  }
}

// ---------------------- LINKS ------------------------------

module.exports.addLinks = async (req, res) => {
  try {
    if (req.body.link) {

      await db.query('INSERT INTO `links` SET ?', { link : req.body.link})
      
      res.json({
        message : "successful addition",
        link : req.body.link
      }) 

    } else {
      res.status(409).json({ message: "Не передано link" })
    }
  } catch (err) {
    log.Fatal('Добавление ссылки', 'config/links', 'addLinks', err.toString());
    res.status(409).json({ message: 'Ошибка при добавлении ссылки' })
  }
}

module.exports.updateLinks = async (req, res) => {
  try {
    if (req.params.id && req.body.link) {
      const link = await db.execute('SELECT * FROM `links` WHERE `id` = ?', [req.params.id])
       
      if(link[0].length > 0){
        await db.execute('UPDATE `links` SET link = ? WHERE id = ?', [req.body.link, req.params.id])

        res.json({
          message : "successful update",
          oldLink : link[0][0].link,
          newLink : req.body.link
        }) 

      }else{
        res.status(409).json({message : 'Такой ссылки не существует'})
      } 

    } else {
      res.status(409).json({ message: "Не передано id и link" })
    }
  } catch (err) {
    log.Fatal('Обновление ссылки', 'config/links', 'updateLinks', err.toString());
    res.status(409).json({ message: 'Ошибка при обновлении ссылки' })
  }
}

module.exports.deleteLinks = async (req, res) => {
  try {
    if (req.params.id) {
      const link = await db.execute('SELECT * FROM `links` WHERE `id` = ?', [req.params.id])
       
      if(link[0].length > 0){
        await db.execute('DELETE FROM `links` WHERE `id` = ?', [req.params.id])

        res.json({
          message : "successful deletion", 
          link : link[0][0].link
        }) 

      }else{
        res.status(409).json({message : 'Такой ссылки не существует'})
      } 

    } else {
      res.status(409).json({ message: "Не передано id" })
    }
  } catch (err) {
    log.Fatal('Удаление ссылки', 'config/links', 'deleteLinks', err.toString());
    res.status(409).json({ message: 'Ошибка при удалении ссылки' })
  }
}

// ---------------------- QUOTES ------------------------------

module.exports.addQuotes = async (req, res) => {
 
    if (req.body.alias && req.body.name && req.body.open && req.body.close) {

      const quote = { 
        alias : req.body.alias,
        name : req.body.name,
        open : req.body.open,
        close : req.body.close,
      }

      await db.query('INSERT INTO `quotes_config` SET ?', quote)
      
      res.json({
        message : "successful addition",
        quote : quote
      }) 

    } else {
      res.status(409).json({ message: "Не передано alias, name, open, close" })
    }
    try { } catch (err) {
    log.Fatal('Добавление настройки(quotes)', 'config/quotes', 'addQuotes', err.toString());
    res.status(409).json({ message: 'Ошибка при добавлении настройки(quotes)' })
  }
}

module.exports.updateQuotes = async (req, res) => {
  try {
    if (req.params.id && req.body.alias && req.body.name && req.body.open && req.body.close) {

      const quote = await db.execute('SELECT * FROM `quotes_config` WHERE `id` = ?', [req.params.id])
       
      if(quote[0].length > 0){

        await db.execute('UPDATE `quotes_config` SET alias = ?, name = ?, open = ?, close = ?  WHERE id = ?', [
          req.body.alias, req.body.name, req.body.open, req.body.close, req.params.id
        ])

        res.json({
          message : "successful update",
          oldQuote : quote[0][0],
          newQuote : {
            id : req.params.id,
            alias : req.body.alias,
            name : req.body.name,
            open : req.body.open,
            close : req.body.close
          }
        }) 

      }else{
        res.status(409).json({message : 'Такой ссылки не существует'})
      } 

    } else {
      res.status(409).json({ message: "Не передано id, alias, name, open, close" })
    }
  } catch (err) {
    log.Fatal('Обновление настройки(quotes)', 'config/quotes', 'updateQuotes', err.toString());
    res.status(409).json({ message: 'Ошибка при обновлении настройки(quotes)' })
  }
}

module.exports.deleteQuotes = async (req, res) => {
  try {
    if (req.params.id) {
       const quote = await db.execute('SELECT * FROM `quotes_config` WHERE `id` = ?', [req.params.id])
       
      if(quote[0].length > 0){
        await db.execute('DELETE FROM `quotes_config` WHERE `id` = ?', [req.params.id])

        res.json({
          message : "successful deletion", 
          link : quote[0][0]
        }) 

      }else{
        res.status(409).json({message : 'Такой ссылки не существует'})
      } 

    } else {
      res.status(409).json({ message: "Не передано id" })
    }
  } catch (err) {
    log.Fatal('Удаление настройки(quotes)', 'config/quotes', 'deleteQuotes', err.toString());
    res.status(409).json({ message: 'Ошибка при удалении настройки(quotes)' })
  }
}