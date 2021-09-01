const keys = require('./../config')
const db = require('../config/dataBaseConnection')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

module.exports.getLinks = async (req, res) => {
  try {
    if (req.query.type == 'links') {
      const links = await db.execute('SELECT * FROM `links`')

      res.json({
        message : "successful",
        links : links[0]
      }) 
    } 
  } catch (err) {
    log.Fatal('Выгрузка ссылок', 'config/links', 'getLinks', err.toString());
    res.status(409).json({ message: 'Ошибка при выгрузке ссылок' })
  }
}

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
