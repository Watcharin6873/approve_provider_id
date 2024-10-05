const express = require('express')
const router = express.Router()
const {
    createProviderIDRequest,
    getListProviderIDRequest,
    getProviderIDRequestByID,
    updateProviderRequest,
    updateClientAndSecretKey,
    updateStatusProviderRequest,
    removeProviderRequest,
    getHospitals
} = require('../Controllers/ProviderIDRequest')
const { currentUser } = require('../Controllers/Auth')
const { auth, approverCheck } = require('../Middleware/Auth')


router.post('/createProviderIDRequest',auth, createProviderIDRequest)

router.get('/getListProviderIDRequest',auth, getListProviderIDRequest)

router.get('/getProviderIDRequestByID/:id',auth, getProviderIDRequestByID)

router.put('/updateProviderRequest/:id',auth, updateProviderRequest)

router.put('/updateClientAndSecretKey/:id',auth, approverCheck,updateClientAndSecretKey)

router.put('/updateStatusProviderRequest/:id',auth, updateStatusProviderRequest)

router.delete('/removeProviderRequest/:id',auth, removeProviderRequest)

router.get('/getHospitals', auth, getHospitals)

module.exports = router