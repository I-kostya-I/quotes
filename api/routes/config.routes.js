const {Router} = require('express')
const passport = require('passport')
const ctr = require('./../controllers/config.controller') 
const router = Router()
 
router.get('/', passport.authenticate('jwt', { session : false }),  ctr.getLinks)

router.post('/links', passport.authenticate('jwt', { session : false }),  ctr.addLinks)

router.patch('/links/:id', passport.authenticate('jwt', { session : false }),  ctr.updateLinks)

router.delete('/links/:id', passport.authenticate('jwt', { session : false }),  ctr.deleteLinks)

module.exports = router