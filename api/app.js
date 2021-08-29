const app = require('express')()
const server = require('http').createServer(app) 
// -----------------------------------------------------------

const bodyParser = require('body-parser') 
const passport = require('passport')  
const passportStategy = require('./middleware/passport-starategy')

const authRoutes = require('./routes/auth.routes')  
const quotesRoutes = require('./routes/quotes.routes')  
// -----------------------------------------------------------

app.use(passport.initialize())
passport.use(passportStategy)

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())  

// -----------------------------------------------------------

app.use('/api/auth', authRoutes) 
app.use('/api/quotes', quotesRoutes)  

module.exports = {app, server}