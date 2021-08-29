const {Router} = require('express')
const passport = require('passport')
const ctr = require('./../controllers/quotes.controller')
// const validate = require('../middleware/validate-user-role')
const router = Router()
 
// router.post('/setPassword', passport.authenticate('jwt', { session : false }), validate.access(["ADMIN", "ROOT", "USER"], false),  ctr.setPassword)
router.get('/', passport.authenticate('jwt', { session : false }),  ctr.getQuotes)

router.post('/', passport.authenticate('jwt', { session : false }),  ctr.addQuotes)

module.exports = router