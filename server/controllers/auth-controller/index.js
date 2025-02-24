
const User = require('../../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

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
    const loginUser = async (req,res) =>{
        const {userEmail,password} = req.body;
        const checkUser = await User.findOne({userEmail})

        if(!checkUser || !(await bcrypt.compare(password,checkUser.password))){
            res.status(401).json({
                success : false,
                message : "Invalid Credentails",
            });
        }
        const accessToken = jwt.sign({
            _id : checkUser._id,
            userName:checkUser.userName,
            userEmail:checkUser.userEmail,
            role:checkUser.role
        },
        process.env.JWT_SECRET,
        {expiresIn:'120m'})

        res.status(200).json({
            success :true,
            message : "Logged in Succesfully",
            data:{
                accessToken,
                user : {
                    _id : checkUser._id,
                    userName:checkUser.userName,
                    userEmail:checkUser.userEmail,
                    role:checkUser.role
                }
            }
        })
    }
    

module.exports={registerUser ,loginUser}