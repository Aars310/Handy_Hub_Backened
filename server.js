const express=require("express");

const app=express();

const dotenv=require("dotenv");
dotenv.config();

const connect=require("./db/configDb");
connect();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const cors=require("cors");
app.use(cors({
    origin:['https://handyhub31.netlify.app',"http://127.0.0.1:5173"],
    methods:["POST","GET"],
    credentials:true,
    allowedHeaders: ["Content-Type"],
})
)
// app.use((req, res, next) => {
//         res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5173"),
//         res.header(
//             "Access-Control-Allow-Headers",
//             "Origin, X-Requested-with, Content-Type, Accept",
           
//         );
        
//         res.header("Access-Control-Allow-Credentials", "true"); // Allow credentials
       
//         next();
//     });
app.get('/',(req,res)=>{
    console.log("Hii");
    res.send("<h1>Hello</h1>")
})


app.use('/api/v1/user',require("./routes/userRoutes"));
app.use('/api/v1/work',require("./routes/workRoutes"));

const PORT=process.env.PORT;

app.listen(PORT,(req,res)=>{
    console.log('server is listening',PORT);
})