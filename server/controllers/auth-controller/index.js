
const User = require('../../models/User')
const bcrypt = require('bcryptjs')

const registerUser = async(req ,res)=>{
    const {userName,userEmail,password,role}=req.body

    const exisitingUser = await User.findOne({$or : [{userEmail} , {userName}] })

    if(exisitingUser){
        return res.status(400).json({
            success : false,
            message : 'User name or user Email already exits'
        })
    }

    const hashPassword= await bcrypt.hash(password,10)
    const newUser = new User({userName,userEmail, role , password : hashPassword})

    await newUser.save()
    return res.status(201).json({
        success: true,
        message : "User registered successfully"
    })
}

module.exports={registerUser}