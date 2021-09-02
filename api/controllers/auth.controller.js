const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

const keys = require('./../config')
const db = require('../config/dataBaseConnection')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

module.exports.login = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {

      const [rows] = await db.execute('SELECT * FROM `users` WHERE `email` = ?', [req.body.email])

      if (rows.length > 0) {

        const candidate = rows[0]

        const isPassCorrect = bcrypt.compareSync(req.body.password, candidate.password)

        if (isPassCorrect) {

          let tonek_data = {
            userId: candidate.id
          }

          const token = jwt.sign(tonek_data, keys.JWT, { expiresIn: keys.JWT_EX })

          res.json({ token })

        } else {
          log.Error('Пользователя не найден', 'auth', 'login');
          res.status(409).json({ message: "Пользователя не найден" })
        }

      } else {
        res.status(409).json({ message: 'Такого пользователя не существует' })
      }

    } else {
      res.status(409).json({ message: "Не передано Email или Password" })
    }
  } catch (err) {
    log.Fatal('Авторизация пользователя', 'auth', 'login', err.toString());
    res.status(409).json({ message: 'Ошибка при авторизации пользователя' })
  }

}

module.exports.singUp = async (req, res) => {
  try {
    if (req.body.email && req.body.password) { 

      const [rows] = await db.execute('SELECT * FROM `users` WHERE `email` = ?', [req.body.email])

      if (rows.length > 0) {
        res.status(409).json({ message: "Такой пользователь уже существует" })
      } else {

        const salt = bcrypt.genSaltSync(10) 

        await db.query('INSERT INTO `users` SET ?', {
          email: req.body.email, 
          password: bcrypt.hashSync(req.body.password, salt)
        })

        res.json({ message: `Пользователь email : ${req.body.email} успешно добавлен` }) 
      }
 
    } else {
      res.status(409).json({ message: "Не передано email, password" })
    }
  } catch (err) {
    log.Fatal('Создание пользователя', 'auth', 'singUp', err.toString());
    res.status(409).json({ message: 'Ошибка при создании пользователя' })
  }
}