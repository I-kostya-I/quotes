const bcrypt = require('bcrypt-nodejs')
const jwt = require('jsonwebtoken')

const keys = require('./../config')
const db = require('../config/dataBaseConnection')

const log = require('node-file-logger');
log.SetUserOptions(keys.LOG_OPTIONS);

module.exports.login = async (req, res) => {
    
  if( req.body.email && req.body.password ){ 
    
    try{

      const [rows] = await db.execute('SELECT * FROM `users` WHERE `email` = ?', [req.body.email])
        
        if(rows.length > 0 ){
          
          const candidate = rows[0]  

          const isPassCorrect = bcrypt.compareSync(req.body.password, candidate.password)  
      
          if(isPassCorrect){ 

            let tonek_data = {
              userId: candidate.id
            } 
            
            const token = jwt.sign(tonek_data, keys.JWT, { expiresIn: keys.JWT_EX })
        
            res.json({ token })

          } else {
            log.Error('Пользователя не найден', 'auth', 'login');
            res.status(409).json({message: "Пользователя не найден"})
          } 

        } else {
          res.status(409).json({message : 'Такого пользователя не существует'}) 
        }
   
    } catch (err){
      log.Fatal('Авторизация пользователя', 'auth', 'login', err);
      res.status(409).json({message : 'Ошибка при авторизации пользователя'})
    }  

  }else{ 
    res.status(409).json({message : "Не передано Email или Password"}) 
  } 

} 