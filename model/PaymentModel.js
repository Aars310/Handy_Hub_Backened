const mongoose=require("mongoose");
const paymentSchema=new mongoose.Schema({
    mobileNo:{
        type:String,
        required:true
    },
    totalamount:{
        type:String,
        required:true
    },
    workforceid:{
        type:String,
        required:true
    }
},{timestamps:true});
const payment=mongoose.model("payment",paymentSchema);
module.exports=payment;