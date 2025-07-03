const express = require('express')
const {auth}=require('../middleware/auth')
const {registerUser, editUser, getAllUser, deleteUser,userProfileView } = require('../controllers/userController')
const { login } = require('../controllers/authController')
const { Roles } = require('../utility/constant')
const router = express.Router()

router.post('/userList',auth(Roles.ADMIN), getAllUser)
router.get('/profile',auth(), userProfileView)
router.post('/register', registerUser)
router.put('/editUser/:id',auth(), editUser)
router.delete('/deleteUser/:id', deleteUser)
router.post('/login', login)
module.exports = router 
