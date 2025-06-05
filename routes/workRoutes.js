const express=require("express");
const { payController, addWorkForce, contactController, getworkforceController, tokenController, joinController } = require("../controller/workController");

const router=express.Router();

router.post('/add-workforce',addWorkForce);
router.post('/pay',payController);

router.post('/contact',contactController);
router.get('/get-workforce',getworkforceController);

router.get('/token',tokenController);
router.post('/join',joinController);

module.exports=router;