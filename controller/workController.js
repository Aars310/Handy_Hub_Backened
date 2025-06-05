const contactmodel=require("../model/contactModel");
const servicemodel=require("../model/serviceModel");
const paymodel=require("../model/payModel");
const PDFDocument = require("pdfkit");
const joinmodel=require("../model/JoinModel");
// import razorpay from "razorpay";
// import crypto from "crypto";

const addWorkForce=async(req,res)=>{
    try{
    const {name,mobileNo,altmobileNo,work,address,workexperiences,workpay,workforceid}=req.body;
    if(!name||!mobileNo||!altmobileNo||!work
        ||!address||!workexperiences||!workpay||!workforceid)
    {
        return res.status(401).json({
            message:"please provide full details",
            success:false
        })
    }
    const service=new servicemodel(req.body);
    await service.save();
    return res.status(200).json({
        message:"workForce added success",
        success:true
    })
}catch(err){
    return res.status(500).json({
        message:"err in workforce adding",
        success:false
    })
}
}

const contactController = async (req, res) => {
    console.log("Hii in Contact");
  try {
    
    const { name, phoneNo, work, address, workforceid } = req.body;

    // Validate request data
    if (!name || !phoneNo || !work || !address || !workforceid) {
        console.log("Hii in Contact 400");
      return res.status(400).json({
        message: "Please provide full details",
        success: false,
      });
    }

    // Save data to the database
    try {
      const contact = new contactmodel(req.body);
      await contact.save();
    } catch (dbError) {
      return res.status(500).json({
        message: "Failed to save data to the database",
        success: false,
      });
    }

    // Initialize PDF document and chunks array
    const doc = new PDFDocument();
    const chunks = [];

    // Collect chunks of data as the PDF is generated
    doc.on("data", (chunk) => {
      chunks.push(chunk);
    });
    console.log(chunks.length());
    // Handle the end of PDF generation
    doc.on("end", () => {
      const result = Buffer.concat(chunks);

      if (!result || result.length === 0) {
        return res.status(500).json({
          message: "Failed to generate PDF",
          success: false,
        });
      }

      // Explicitly set the response headers for PDF
      res.status(200).set({
        "Content-Type": "application/pdf",
        "Content-Length": result.length,
      });

      // Send the PDF file in the response
      res.end(result);
    });

    // Add content to the PDF
    doc.fontSize(20).text("Form Submission Data", { underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${name}`);
    doc.text(`Phone Number: ${phoneNo}`);
    doc.text(`Work: ${work}`);
    doc.text(`Address: ${address}`);
    doc.text(`Workforce ID: ${workforceid}`);

    // Finalize the PDF document
    doc.end();
  } catch (err) {
    console.error("Error in handling contact:", err);
    return res.status(500).json({
      message: "Error in sending request or generating PDF",
      success: false,
    });
  }
};

var braintree = require("braintree");
const paymentmodel = require("../model/PaymentModel");

var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: "6bqmn43dmfgg2ws4",
  publicKey: "k4zhkf7nmr7pyvnp",
  privateKey: "8ec2361ffbd4a6e1502a1a9a0003b362",
});

  

const payController=async(req,res)=>{
    try{
    const {name,mobileNo,work,address,workpay,workforceid,hourtowork,totalamount}=req.body;
    if(!name||!mobileNo||!hourtowork||!work
        ||!address||!totalamount||!workpay||!workforceid)
    {
        return res.status(401).json({
            message:"please provide full details",
            success:false
        })
    }
    gateway.transaction.sale(
      {
        amount: `${totalamount}`,
        paymentMethodNonce: "nonce-from-the-client",
        options: {
          submitForSettlement: true,
        },
      },
      function (err, result) {
        if (err) {
          console.error(err);
          return;
        }
    
        if (result.success) {
          
        
          console.log("Transaction ID: " + result.transaction.id);
        } else {
          console.error(result.message);
        }
      }
    );
    const paymemt= await paymentmodel.create({
      mobileNo,
      totalamount,
      workforceid,
    });
    const pay=new paymodel(req.body);
    pay.save();

    return res.status(201).json({
        message:"pay success",
        success:true
    })
}catch(err){
    return res.status(500).json({
        message:"err in pay",
        success:false
    })
}
}
const getworkforceController=async(req,res)=>{
    try{
        console.log("Hii");
        const data=await servicemodel.find({});
        return res.status(200).json({
            message:"data fetch success",
            success:true,
            data
        })
    }
    catch(err){
        return res.status(500).json({
            message:"err in getwork",
            success:false
        })
    }

}

const tokenController=(req,res)=>{
  try{
    gateway.clientToken.generate({},function(err,response){
      if(err){
        return res.status(500).send(err);
      }
      else{
        return res.send(response);
      }
    })
  }
  catch(err){
    consoel.log(err)
    return res.status(500).json({
      message:"Err in token generate",
      success:false
    })
  }
}

const joinController=(req,res)=>{
  try{
    const {name,address,mobileNo,work,workpay,Aadhar_Card,exp}=req.body;
    if(!name||!address||!mobileNo||!work||!workpay||!Aadhar_Card||!exp)
    {
      return res.status(400).json({
        message:"Please provide all details",
        success:false
      })
    }
    const joindata=new joinmodel(req.body);
    joindata.save();
    return res.status(200).json({
      message:"Request for Join Success",
      success:true
    })
  }catch(error){
    console.log(error);
    return res.status(500).json({
      message:"error in join request",
      success:false
    })
  }
}
module.exports={
  addWorkForce,
  payController,
  contactController,
  getworkforceController,
  tokenController,
  joinController
}