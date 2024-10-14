// Import necessary modules using require
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cookie = require('cookie');
const { validate } = require('deep-email-validator');
const nodemailer = require('nodemailer');

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
  return Math.floor(Math.random() * (max - min)) + min;
}

// MongoDB setup
const mongodb = new MongoClient(process.env.DB_URL);

(async () => {
  await mongodb.connect();
})();

const passwords = mongodb.db('sessions_db').collection('passwords');
const ipAttempts = mongodb.db('sessions_db').collection('Login_attemps');
const verify_emails = mongodb.db('sessions_db').collection('verify_emails');

(async () => {
  await ipAttempts.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 600 });
  await verify_emails.createIndex({ "createdAt": 1 }, { expireAfterSeconds: 60 });
})();

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.SESSIONS_SECRET_KEY, { expiresIn: '24h' });
};

const sendemail = (email, num) => {
  const mailOptions = {
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

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
};

// User signup
const signupSession = async (req, res) => {
  const { name, email, password } = req.body;
  const email_Validation = await validate({ email: email, validateSMTP: false });

  if (!email_Validation.valid || validatePassword(password) !== "") {
    return res.json({
      success: false,
      title: "Sign up failed",
      message: 'Please enter valid email or password',
      showError: true,
      auth: false
    });
  }

  const info = await passwords.findOne({ email });
  if (info && info.verify) {
    return res.json({
      success: false,
      title: "Sign up failed",
      message: 'Email already exists',
      showError: true,
      auth: false
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await passwords.updateOne(
      { email: email },
      { 
        $set: { 
          password: hashedPassword,
          name: name,
          verify: false 
        } 
      },
      { upsert: true }
    );
    
    const num = getRndInteger(100000, 999999);
    await verify_emails.updateOne(
      { email: email },
      { $set: { num: num, count: 0 } },
      { upsert: true }
    );

    await sendemail(email, num);
    return res.json({ success: true, message: 'Signup success', showError: false, auth: true, email: email });
  } catch (err) {
    return res.status(500).json({ success: false, message: 'Signup failed', error: err.message, showError: true, auth: false });
  }
};

// User login
const loginSession = async (req, res) => {
  const { email, password } = req.body;
  const userIP = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  const email_Validation = await validate({ email: email, validateSMTP: false });
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
  if (!info || !info.verify) {
    const num = getRndInteger(100000, 999999);
    await verify_emails.updateOne(
      { email: email },
      { $set: { num: num, count: 0 } },
      { upsert: true }
    );
    
    await sendemail(email, num);
    return res.json({ verify: true });
  }

  const ipRecord = await ipAttempts.findOne({ email, ip: userIP });
  
  if (ipRecord && ipRecord.failedAttempts > 10) {
    return res.status(403).json({
      success: false,
      title: "Login failed",
      message: "Too many failed attempts from your IP. You are banned for 10 minutes.",
      showError: true,
      auth: false
    });
  }

  try {
    const isPasswordValid = await bcrypt.compare(password, info.password);
    if (isPasswordValid) {
      await ipAttempts.deleteOne({ email, ip: userIP });
      
      const tokenPayload = { email: info.email, password: info.password, name: info.name, data: Date.now() };
      const token = generateToken(tokenPayload);

      res.cookie('jwtToken', token, {
        secure: false,
        httpOnly: true,
        path: '/',
        maxAge: 24 * 60 * 60 * 1000,
      });

      return res.json({
        success: true,
        email: info.email,
        name: info.name,
        message: 'Login successful',
        token: token,
        auth: true
      });
    } else {
      const failedAttempts = ipRecord ? ipRecord.failedAttempts + 1 : 1;
      await ipAttempts.updateOne(
        { email, ip: userIP },
        { $set: { email, ip: userIP, failedAttempts, createdAt: new Date() } },
        { upsert: true }
      );

      return res.status(401).json({
        success: false,
        title: "Login failed",
        message: `Invalid password. ${10 - failedAttempts} attempts remaining from your IP.`,
        showError: true,
        auth: false
      });
    }
  } catch (err) {
    return res.status(500).json({
      success: false,
      title: "Login failed",
      message: "An error occurred during login",
      showError: true,
      auth: false
    });
  }
};

const Check_differance = (timestamp) => {
  const twentyOneDaysInMilliseconds = 21 * 24 * 60 * 60 * 1000;
  return Date.now() - timestamp > twentyOneDaysInMilliseconds;
};

const AreIamAuthenticated = (req, res) => {
  try {
    const token = req.cookies["jwtToken"];
    if (!token) {
      return res.json({ auth: false });
    }

    jwt.verify(token, process.env.SESSIONS_SECRET_KEY, (err, payload) => {
      if (err) {
        return res.json({ auth: false });
      }

      if (Check_differance(payload.data)) {
        return res.json({ auth: false });
      }

      return res.json({ auth: true, email: payload.email, name: payload.name });
    });
  } catch (err) {
    return res.json({ auth: false });
  }
};

const logout = (req, res) => {
  res.clearCookie('jwtToken', {
    path: '/',
    httpOnly: true,
    secure: false,
    sameSite: 'Lax',
  });

  return res.json({ success: true, message: 'Logged out successfully' });
};

// Export functions
module.exports = {
  signupSession,
  loginSession,
  AreIamAuthenticated,
  logout
};
