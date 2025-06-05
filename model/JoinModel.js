const mongoose=require("mongoose");

const joinSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    mobileNo:{
        type:String,
        required:true
    },
    work:{
        type:String,
        required:true
    },
    workpay:{
        type:String,
        required:true
    },
    Aadhar_Card:{
        type:String,
        required:true
    },
    exp:{
        type:String,
        required:true
    }
},{timestamps:true})
const join=mongoose.model('join',joinSchema);
module.exports=join;