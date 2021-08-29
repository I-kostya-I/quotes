const { ExtractJwt, Strategy } = require('passport-jwt')
const db = require('../config/dataBaseConnection')
const keys = require('../config')

const options = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : keys.JWT
}

module.exports = new Strategy( options, async (payload, done) => { 
    try{  
        
        let candidate = await db.execute('SELECT * FROM `users` WHERE `id` = ?', [payload.userId])
         
        if(candidate[0].length > 0 ){ 
            done(null, { userData : candidate[0][0], payload })
        } else {
            done(null, false)
        }
        
    }catch(e){
        console.error(e)
        done(null, false)
    } 
})