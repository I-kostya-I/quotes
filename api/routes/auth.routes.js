const {Router} = require('express')
// const passport = require('passport')
const ctr = require('./../controllers/auth.controller')
// const validate = require('../middleware/validate-user-role')
const router = Router()

router.post('/login', ctr.login)

// router.post('/setPassword', passport.authenticate('jwt', { session : false }), validate.access(["ADMIN", "ROOT", "USER"], false),  ctr.setPassword)

module.exports = router