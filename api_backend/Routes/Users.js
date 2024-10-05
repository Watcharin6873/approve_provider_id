const express = require('express')
const router = express.Router()
const {
    createUser, 
    getListUsers,
    getUserByID,
    updateUser,
    resetPassword
} = require('../Controllers/Users')


const { currentUser } = require('../Controllers/Auth')
const { auth, approverCheck } = require('../Middleware/Auth')


router.post('/createUser',auth, createUser)

router.get('/getListUsers',auth, getListUsers)

router.get('/getUserByID/:id', auth, getUserByID)

router.put('/updateUser/:id', auth, updateUser)

router.put('/resetPassword/:id', auth, resetPassword)


module.exports = router