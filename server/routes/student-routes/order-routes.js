
const express = require('express')
const {createOrder, capturePaymentandFinializeOrder} = require('../../controllers/student-controller/order-controller')

const  router  = express.Router()
router.post('/create',createOrder),
router.post('/capture',capturePaymentandFinializeOrder)

module.exports = router