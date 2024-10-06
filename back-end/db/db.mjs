
import dotenv from 'dotenv';
dotenv.config("../.env")
import mongoose from 'mongoose';
const Schema = mongoose.Schema;
const ConnectDB = async ()=>{
    try{
        const conn = await mongoose.connect(
         process.env.DB_URL
        ).then(console.log('connected'));
        
    }catch(error)
    {
        console.log({message:`failed to connect to db ${error}`});
        process.exit(1);
    };
    
}

export default ConnectDB;