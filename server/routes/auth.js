const express=require('express')
const router=express.Router();
const authController =require('../controller/user')
const verifyToken=require('../middleware/verifyToken')

router.post('/register',authController.registerUser)
router.post('/login',authController.loginUser)
router.post('/logout',authController.logoutUser)



module.exports=router