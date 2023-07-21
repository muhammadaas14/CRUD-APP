const mongoose = require('mongoose');
const jwt = require ('jsonwebtoken');

const userschema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    created:{
        type:Date,
        required:true,
        default:Date.now
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
})

userschema.methods.createtoken=async function(){
    const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY);
    this.tokens.push({token});
    await this.save();

}
module.exports = mongoose.model("Persona",userschema)