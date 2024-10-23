const express = require('express')
const router = express.Router()

const {login,loginByProviderId, currentUser} = require('../Controllers/Auth')
const {auth, approverCheck} = require('../Middleware/Auth')


router.post('/login', login)

router.post('/loginByProviderId', loginByProviderId)

router.post('/currentResponder', auth, currentUser)

router.post('/currentApprover', auth, approverCheck, currentUser)


module.exports = router