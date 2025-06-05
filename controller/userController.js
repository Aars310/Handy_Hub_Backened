const bcrypt=require("bcryptjs");
const usermodel = require("../model/usermodel");
const jwt=require("jsonwebtoken");
const servicemodel=require("../model/serviceModel");

const RegisterController=async(req,res)=>{
    try{
       let {name,mobileNo,password}=req.body;
       if(!name||!mobileNo||!password){
            return res.status(400).json({
                message:"please provide all details",
                success:false
            })
       }
       const hashPassword=await bcrypt.hash(password,10);
       req.body.password=hashPassword;
       const user=new usermodel(req.body);
       user.save();

       return res.status(201).json({
        message:"Register successful",
        success:true
       })
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"error in register",
            success:false
        })
    }
}
const loginController=async(req,res)=>{
    try{
        const {mobileNo,password}=req.body;
        if(!mobileNo||!password)
        {
            return res.status(400).json({
                message:"Fill all details",
                success:false
            })
        }
        const user=await usermodel.findOne({mobileNo});
        console.log(user);
        if(!user){
            return res.status(400).json({
                message:"user or password doesnot exist",
                success:false
            })
        }
        let check=await bcrypt.compare(password,user.password);
        console.log(check);
        if(check){
            const payload={
                id:user._id
            }
            let token=jwt.sign(payload,"Aars",{
                expiresIn:"1d",
            });
            console.log(token);
            res.setHeader('authorization', `Bearer ${token}`);
            return res.status(201).json({
                message:"login successful",
                success:true,
                token
            })
        }
        else{
            return res.status(401).json({
                message:"credentials doesnot match",
                success:false
            })
        }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:"err in login",
            success:false
        })
    }
}

const RatingController=async(req,res)=>{
    try{
    const {workforceid,rating}=req.body;
    const data=await servicemodel.find({workforceid:workforceid});
    if(data){
        console.log(data);
    let count=data[0].ratingCount;
    let previousRating=data[0].rating;
    console.log(rating,previousRating);
   let newcount=count+1;
    let newRating=(previousRating*count+rating)/newcount;
    await servicemodel.updateOne(
        { workforceid: data[0].workforceid }, // Identify the record
        { $set: { rating: newRating, ratingCount: newcount } } // Update the fields
    )
    return res.status(200).json({
        message:"Rating Done Successful",
        success:true
    })
    }
    }catch(err){
        console.log(err);
        return res.status(500).json({
            message:'err in rating',
            success:false
        })
    }

}

module.exports={RegisterController,loginController,RatingController};