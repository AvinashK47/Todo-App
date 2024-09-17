const mongoose = require('mongoose');
require('dotenv').config();

const url = process.env.MONGO_URL;

const ConnectDB = async ()=>{
    await mongoose.connect(url);
    console.log("Connected to DB");
}

const Schema = mongoose.Schema;

const ObjectId = Schema.ObjectId ;

const User = new Schema({
    name : String,
    email : { type : String , unique : true },
    password : String
});

const Todo = new Schema({
    userId: ObjectId,
    title : String,
    done : Boolean
})

const UserModel = mongoose.model('users',User);
const TodoModel = mongoose.model('todos',Todo);

module.exports = {ConnectDB,UserModel,TodoModel}