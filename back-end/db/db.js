// Importing dotenv and mongoose using require
const dotenv = require('dotenv');
dotenv.config({ path: "../.env" }); // Use an object with path to specify .env location

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Async function to connect to the database
const ConnectDB = async () => {
    try {
        const conn = await mongoose.connect(
            process.env.DB_URL
        );
        console.log('connected');
    } catch (error) {
        console.log({ message: `failed to connect to db ${error}` });
        process.exit(1); // Exit process if unable to connect
    }
};

// Exporting the ConnectDB function using module.exports
module.exports = ConnectDB;