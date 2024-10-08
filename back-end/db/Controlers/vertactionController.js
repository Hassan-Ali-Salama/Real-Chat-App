// Import necessary modules using require
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cookie = require('cookie');
const { validate } = require('deep-email-validator');

dotenv.config();
const mongodb = new MongoClient(process.env.DB_URL);

(async () => {
    await mongodb.connect();
})();

const verify_emails = mongodb.db('sessions_db').collection('verify_emails');
const passwords = mongodb.db('sessions_db').collection('passwords');

// Ensure the index is created for documents to expire after 10 minutes

const verification = async (req, res) => {
    try {
        console.log("verification");
        const { num, email } = req.body;
        console.log("email", email);

        const info = await verify_emails.findOne({ email: email });

        if (info) {
            if (info.count < 3) { // Ensure count is greater than zero
                if (num != info.num) {
                    await verify_emails.updateOne({ email: email }, { $inc: { count: 1 } }); // Corrected the operator 

                    return res.json({
                        success: false,
                        title: "Sign up failed",
                        message: 'Wrong number',
                        showError: true,
                        auth: false
                    });
                }

                await passwords.updateOne({ email: email }, { $set: { verify: true } }); // Corrected the operator
                return res.json({
                    success: true,
                    title: "Sign up success",
                    message: 'You can now log in',
                    showError: false,
                    auth: true
                });
            } else {
                return res.json({
                    success: false,
                    title: "Sign up failed",
                    message: 'Exceeding the number of attempts allowed for verification',
                    showError: true,
                    auth: false
                });
            }
        } else {
            return res.json({
                success: false,
                title: "Sign up failed",
                message: 'No verification info found',
                showError: true,
                auth: false
            });
        }
    } catch (error) {
        console.error("Error during verification:", error);
        return res.status(500).json({
            success: false,
            title: "Server Error",
            message: 'An error occurred during verification',
            showError: true,
            auth: false
        });
    }
};

// Export the verification function using module.exports
module.exports = { verification };