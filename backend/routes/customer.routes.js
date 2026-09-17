import express from 'express'
import { registerCustomer,
         loginCustomer,
         getProfile,
         logoutCustomer
} from '../controllers/customer.controller.js'
import { authMiddleware } from '../middlewares/auth.middleware.js'


const customerRoutes = express.Router()

customerRoutes.post("/register",registerCustomer);
customerRoutes.post("/login",loginCustomer);
customerRoutes.get("/me",authMiddleware,getProfile);
customerRoutes.post("/logout",authMiddleware,logoutCustomer);

export default customerRoutes
