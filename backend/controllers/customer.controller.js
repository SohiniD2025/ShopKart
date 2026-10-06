import Customer from "../models/customer.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import generateToken from '../utils/generateToken.js'

export const registerCustomer=  async(req,res)=>{
            const {fullName,email,password,phone}=req.body

            try{
                        if(!fullName || !email || !password || !phone){
                                    return res.status(400).json({
                                                success:false,
                                                message: "Missing field"
                                    });
                        }
                        if(password.length< 6){
                                    return res.status(400).json({
                                                success:false,
                                                message:"Password too short"
                                    });
                        }

                        const existingCustomer = await Customer.findOne({email})

                        if(existingCustomer){
                                    return res.status(409).json({
                                                success:false,
                                                message:"Email already exists"
                                    });
                        }

                        const hashedPass = await bcrypt.hash(password,10) //cost factor and salting

                        const customer = await Customer.create({
                                    fullName,
                                    email,
                                    password:hashedPass,
                                    phone
                        });

                        res.status(201).json({
                                    success:true,
                                    message:"Successful registration",
                                    customer:{
                                                id:customer.id,
                                                fullName:customer.fullName,
                                                phone:customer.phone,
                                                email:customer.email
                                    }
                        });


            }catch(err){
                        res.status(500).json({
                                    success: false,
                                    message: "Server error"
                        });
            }
}


export const loginCustomer = async (req,res)=>{
            const { email, password } = req.body;

            try{

                        const customer = await Customer.findOne({email})//remember this function
            
                        if(!customer){
                                    return res.status(401).json({
                                                success:false,
                                                message:"Invalid credentials"
                                    });
                        }
            
                        const isMatch = await bcrypt.compare(password,customer.password)

                        if(!isMatch){
                                    return res.status(401).json({
                                                success: false,
                                                message: "Invalid credentials"
                                    });
                        }

                        //create jwt token 

                        const token = generateToken(customer._id)

                        //Store JWT in an HttpOnly cookie
                        res.cookie("token",token,{
                                    httpOnly:true,
                                    secure:false //for now till I deploy it , because rn I am hosting it locally,later I can write true.
                        });
                        //Send successful response
                        res.status(200).json({
                                    success:true,
                                    message:"Login Successful",
                                    token
                        })
            }catch(err){
                        return res.status(500).json({
                                    success:false,
                                    message:"Server Not Found"
                        });
            }
}

export const getProfile = async (req,res)=>{
            try{
                        res.status(200).json({
                                    _id:req.user._id,
                                    fullName:req.user.fullName,
                                    phone:req.user.phone,
                                    email:req.user.email
                        });

            }catch{
                      return res.status(500).json({
                                    success:false,
                                    message:"Server Not Found"
                        });  
            }
}

export const logoutCustomer= async (req,res)=>{
            try{
                        res.clearCookie("token") 

                        res.status(200).json({
                                    success:true,
                                    message:"Logout Successful"
                        })
            }catch(err){
                        return res.status(500).json({
                                    success:false,
                                    message:"Server Not Found"
                        });
            }
}

