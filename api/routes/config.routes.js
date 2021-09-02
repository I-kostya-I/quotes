const {Router} = require('express')
const passport = require('passport')
const ctr = require('./../controllers/config.controller') 
const router = Router()
 
router.get('/', passport.authenticate('jwt', { session : false }),  ctr.getConfig)

// ---------------------- LINKS ------------------------------

router.post('/links', passport.authenticate('jwt', { session : false }),  ctr.addLinks)

router.patch('/links/:id', passport.authenticate('jwt', { session : false }),  ctr.updateLinks)

router.delete('/links/:id', passport.authenticate('jwt', { session : false }),  ctr.deleteLinks)

// ---------------------- QUOTES ------------------------------

router.post('/quotes', passport.authenticate('jwt', { session : false }),  ctr.addQuotes)

router.patch('/quotes/:id', passport.authenticate('jwt', { session : false }),  ctr.updateQuotes)

router.delete('/quotes/:id', passport.authenticate('jwt', { session : false }),  ctr.deleteQuotes)

module.exports = router