import jwt from 'jsonwebtoken';
import Customer from '../models/customer.model.js';

export const authMiddleware =async (req,res,next)=>{
            try{
                        //get token from cookies
                        const token = req.cookies.token;
                        //check if token exists
                        if(!token){
                                    return res.status(401).json({
                                                success:false,
                                                message:"Unauthorized"
                                    })
                        }
                        //verify jwt

                        const decoded= jwt.verify(token, process.env.jwt_secret)
                        //find customer using userId from jwt
                        const customer = await Customer.findById(decoded.customerId);

                        //check if customer exists
                        if(!customer){
                                    return res.status(401).json({
                                                success:false,
                                                message:"Unauthorized"
                                    })
                        }
                        //attach customer to request
                        req.user = customer;
                        //continue to controller
                        next();
            }catch(err){
                         return res.status(401).json({
                                    success: false,
                                    message: "Unauthorized"
                        });
            }
}
