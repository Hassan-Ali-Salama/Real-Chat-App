
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
const userSchema = new Schema({
  name: {
    type: String,
    min: 3,
    max: 255,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
});

const User = ConnectDB.model("user", userSchema);
export default ConnectDB;