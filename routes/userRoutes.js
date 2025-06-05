const express=require("express");
const {RegisterController, loginController, RatingController} = require("../controller/userController");

const router=express.Router();

router.post('/register',RegisterController);
router.post('/login',loginController);

router.post('/rating',RatingController);
module.exports=router;