import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import cookie from 'cookie';
import {validate} from 'deep-email-validator';
import { get } from 'mongoose';
import   nodemailer from 'nodemailer';
dotenv.config();
const validatePassword = (password) => {
  const lengthCheck = password.length >= 8 && password.length <= 128;
  const numberCheck = /[0-9]/.test(password);
  const upperCheck = /[A-Z]/.test(password);
  const lowerCheck = /[a-z]/.test(password);
  const specialCheck = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (!lengthCheck) return "Password must be between 8-128 characters.";
  if (!numberCheck) return "Password must include at least one number.";
  if (!upperCheck) return "Password must include at least one uppercase letter.";
  if (!lowerCheck) return "Password must include at least one lowercase letter.";
  if (!specialCheck) return "Password must include at least one special character.";
  
  return ""; // No errors
};

function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
// MongoDB setup
const mongodb = new MongoClient(process.env.DB_URL);
await mongodb.connect();
const passwords = mongodb.db('sessions_db').collection('passwords');
const ipAttempts = mongodb.db('sessions_db').collection('Login_attemps');
await ipAttempts.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 600 }); // Documents expire after 10 minutes
const  verify_emails= mongodb.db('sessions_db').collection('verify_emails');
await verify_emails.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 60 }); // Documents expire after 10 minutes
// Utility function: JWT generation
var transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});
console.log(process.env.email)
console.log( process.env.SESSIONS_SECRET_KEY)
const generateToken = (payload) => {

  return jwt.sign(payload, process.env.SESSIONS_SECRET_KEY, { expiresIn: '24h' });
};
const sendemail=(email,num)=>{

var mailOptions = {
  from: process.env.email,
  to: email,
  subject: 'Verify Your Email for Chat App',
  text: `Hi

Thank you for signing up with Chat APP! To complete your registration, we just need to verify your email address.

Please use the verification code below to verify your email:
Your Verification Code: ${num}
This code will expire in 60 seconds, so make sure to enter it quickly.

If you didn’t sign up for an account, please ignore this email.

Thanks,
The Ninja Team`
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
}); 
}
// User signup
export const signupSession = async (req, res) => {
  const { name, email, password } = req.body;
  var email_Validation=await validate({email:email,validateSMTP:false})
         console.log(email_Validation.valid,email_Validation,email)

  if (!email_Validation.valid&&validatePassword(password)!="")
    {

res.json({success: false,title:"Sign up failed", message: 'Please enter valid email',showError:true,auth:false})
return;
    }
  const info = await passwords.findOne({ email });
  if (info && info.verify )
    {

res.json({success: false,title:"Sign up failed", message: 'Email already exist',showError:true,auth:false})
return;
    }
    
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
  await passwords.updateOne(
    { email: email },               // Query to find the document by email
    { 
      $set: { 
        password: hashedPassword,   // Update password field
        name: name,                 // Update name field
        verify: false               // Update verify field
      } 
    },
    { upsert: true }                // Insert if the document doesn't exist
  );    
  var num=getRndInteger(100000, 999999)
  await verify_emails.updateOne(
        { email: email },               // Query to find the document
        { $set: { num:num ,count:0 } },  // Update operation
        { upsert: true }                // Insert if the document doesn't exist
      );      
     await   sendemail(email,num)
    res.json({ success: true, message: 'Signup success' ,showError:false,auth:true,email:email});
  } catch (err) {
    res.status(500).json({ success: false, message: 'Signup failed', error: err.message ,showError:true,auth:false});
  }
};

export const loginSession = async (req, res) => {
  console.log("Login");
  const { email, password } = req.body;
  const userIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress; // Get the user's IP address

  // Validate email format
  var email_Validation = await validate({ email: email, validateSMTP: false });
  if (!email_Validation.valid) {
    return res.json({
      success: false,
      title: "Login failed",
      message: "Please enter a valid email",
      showError: true,
      auth: false
    });
  }

  const info = await passwords.findOne({ email });
  if (!info ) {
    return res.status(401).json({
      success: false,
      title: "Login failed",
      message: `Email doesn't exist`,
      showError: true,
      auth: false
    });
  }
  if ( !info.verify)
    {
    var num=getRndInteger(100000, 999999)
  await verify_emails.updateOne(
        { email: email },               // Query to find the document
        { $set: { num:num ,count:0 } },  // Update operation
        { upsert: true }                // Insert if the document doesn't exist
      );      
      await  sendemail(email,num)          
      return res.json({ verify:true})


    }
  // Check IP attempts from the new collection
  const ipRecord = await ipAttempts.findOne({ email, ip: userIP });

  try {    
console.log(ipRecord)
    if (ipRecord&&ipRecord.failedAttempts<=10){
    const isPasswordValid = await bcrypt.compare(password, info.password);
  console.log(password)
    if (isPasswordValid) {
      // If login is successful, delete the failed attempts record for this IP
      await ipAttempts.deleteOne({ email, ip: userIP });

      const tokenPayload = { email: info.email, password: info.password, name: info.name, data: Date.now() };
      const token = generateToken(tokenPayload);

      res.cookie('jwtToken', token, {
        secure: false, // Use true in production with HTTPS
        httpOnly: true, // Prevent client-side access
        path: '/', // Cookie will be accessible for all paths
        maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      });

      return res.json({
        success: true,
        email: info.email,
        name: info.name,
        message: 'Login successful',
        token: token,
        auth: true
      });}
      else
      {

  return res.status(403).json({
          success: false,
          title: "Login failed",
          message: "Too many failed attempts from your IP. You are banned for 10 minutes.",
          showError: true,
          auth: false
        });

      }

    } else {
      // Handle failed password attempts
      const failedAttempts = ipRecord ? ipRecord.failedAttempts + 1 : 1;
      let update = {
        email,
        ip: userIP,
        failedAttempts,
        createdAt: new Date(), // Add createdAt field for TTL
      };

      // Check if the user has failed 10 times from this IP and set the ban time
      if (failedAttempts >= 10) {
        return res.status(403).json({
          success: false,
          title: "Login failed",
          message: "Too many failed attempts from your IP. You are banned for 10 minutes.",
          showError: true,
          auth: false
        });
      }

      // Update or insert failed attempt count for the IP
      await ipAttempts.updateOne(
        { email, ip: userIP },
        { $set: update },
        { upsert: true }
      );

      return res.status(401).json({
        success: false,
        title: "Login failed",
        message: `Invalid password. ${10 - failedAttempts} attempts remaining from your IP.`,
        showError: true,
        auth: false
      })
      ;
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      title: "Login failed",
      message: "An error occurred during login",
      showError: true,
      auth: false
    });
  }
};

function Check_differance(timestamp) {
  // Check if the difference between now and the token's timestamp is more than 21 days
  const twentyOneDaysInMilliseconds = 21 * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp > twentyOneDaysInMilliseconds;
}

export function AreIamAuthenticated(req, res) {
  try {
    // Verify JWT token
    console.log( req.cookies)
    const token = req.cookies["jwtToken"];
    
    if (!token) {
      // No token present
      console.log("No token found");
      return res.json({ auth: false });
    }

    jwt.verify(token, process.env.SESSIONS_SECRET_KEY, (err, payload) => {
      if (err) {
        // Invalid token or verification error
        console.log("Token verification failed:", err);
        return res.json({ auth: false });
      }

      // Check if the token's payload is older than 21 days
      if (Check_differance(payload.data)) {
        console.log("Token has expired");
        return res.json({ auth: false });
      }

      // If token is valid and not expired, user is authenticated
      console.log("User is authenticated");
      return res.json({ auth: true, email:payload.email,name:payload.name});
    });
  } catch (err) {
    console.error("Authentication error:", err);
    return res.json({ auth: false });
  }
}
export function logout(req, res) {
  // Clear the JWT token cookie by setting it to an empty value with an expired date
  res.clearCookie('jwtToken', {
    path: '/',        // Make sure the cookie path matches where it was set
    httpOnly: true,   // Prevent client-side access
    secure: false,    // Use true for production with HTTPS
    sameSite: 'Lax',  // Control cross-origin behavior
  });

  // Respond with success message
  res.json({ success: true, message: 'Logged out successfully' });
}