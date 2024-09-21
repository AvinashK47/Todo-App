const { UserModel,TodoModel, ConnectDB } = require("./db");
const jwt = require("jsonwebtoken");
const {jwtSec} = require("./Auth");
const express = require("express");
const { AuthMiddleware } = require("./Auth");
const bcrypt = require('bcrypt');
const { z } = require("zod");
require("dotenv").config();

app = express();
app.use(express.json());

ConnectDB();

app.post("/signup", async function(req,res){

    const passwd = req.body.password ;

    let ErrorThrown = false ;

    const requiredBody = z.object({
        email : z.string(),
        name : z.string().min(3).max(20),
        password : z.string().min(4).max(50)
    });

    const parsedData = requiredBody.safeParse(req.body);

    if(!parsedData.success){
        return res.json({
            message : "Incorrect Inputs",
            error : parsedData.error
        })
    }
    
    try {

        const hashedPassword = await bcrypt.hash(passwd,5);

        await UserModel.create({
            name : req.body.name,
            email : req.body.email ,
            password : hashedPassword
        })

    }catch(e){
        res.json({
            message : "User already exists"
        })
        ErrorThrown = true;
    }
    if (!ErrorThrown){
        res.json({
            message : "You are Signed up"
        })
    }
})

app.get( "/signin" , async function(req,res){
    
    const response = await UserModel.findOne({
        email : req.body.email
    })

    if(!response){
        return res.status(403).json({
            message : "User does not Exist"
        })
    }

    const password = req.body.password;
    const passwordMatch = await bcrypt.compare(password , response.password)

    if (passwordMatch){
        const token  = jwt.sign({
            userId : response._id
        },jwtSec);

        return res.json({
            token : token
        })
    }
    else {
        return res.json({
            message : "Invalid Credentials"
        })
    }

})
app.post( "/todo" , AuthMiddleware , async function(req,res){

    await TodoModel.create({
        userId : req.userId,
        title : req.body.title,
        done : req.body.done 
    })
    return res.json({
        message : "ToDo Created"
    })
})
app.get( "/todos" , AuthMiddleware , async function(req,res){
    
    const userId = req.userId ;
    
    const todos = await TodoModel.find({
        userId
    })

    return res.json({
        todos
    })

})


app.listen(process.env.PORT);