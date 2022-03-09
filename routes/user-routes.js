import express from "express";
import { createUser, userLogin, getUser } from "../controllers/usercontrollers";
import{ check} from 'express-validator';
import { authorizeUser } from '../middlewares/auth';

const app = express();

app.use(express.json());

// creating user's account

app.post("/signup", [
   check('first_name').isAlpha().withMessage('first name should be in alphabets only').isLength({min:5, max:15})
   .withMessage('first name must be of 5 characters and above'),
   check('email', 'email must be valid').isEmail(),
   check('phone_no', 'Mobile number must be valid').isMobilePhone(),
   check('password').isLength({min: 5}).withMessage('Password must have a minimum lenghth of 5')
],
createUser);

// login endpoint

app.post("/login", userLogin)

// user details endpoint
app.get("/me", authorizeUser, getUser)

export default app