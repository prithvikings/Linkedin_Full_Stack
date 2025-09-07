import mongoose from "mongoose";
const userSchema =new mongoose.Schema({
    firstname:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20
    },
    lastname:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:20
    },
    username:{
        type:String,
        required:true,
        trim:true,
        unique:true,

    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    picture:{
        type:String,
        default:"",
    },
    cover:{
        type:String,
        default:"",
    },
    location:{
        type:String,
        default:"",
    },
    headline:{
        type:String,
        default:"",
    },
    skills:[{
        type:String,

    }],
    connections:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    experiences:[
        {
            title:{
                type:String,
                required:true,
            },
            company:{
                type:String,
                required:true,  
            },
            description:{
                type:String,
            },
        }
    ]
}, {timestamps:true});

const User = mongoose.model("User", userSchema);
export default User;