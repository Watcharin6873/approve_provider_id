const express = require('express')
const router = express.Router()

const {login, currentUser} = require('../Controllers/Auth')
const {auth, approverCheck} = require('../Middleware/Auth')


router.post('/login', login)

router.post('/currentResponder', auth, currentUser)

router.post('/currentApprover', auth, approverCheck, currentUser)


module.exports = router