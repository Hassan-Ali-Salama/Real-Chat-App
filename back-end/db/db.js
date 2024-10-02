const mongoose = require('mongoose');

const ConnectDB = async ()=>{
    try{
        const conn = await mongoose.connect(
          "mongodb+srv://2022170867:5MmUYmD4ElTkEtb7@chat.tq4eg.mongodb.net/?retryWrites=true&w=majority&appName=chat"
        ).then(console.log('connected'));
        
    }catch(error)
    {
        console.log({message:`failed to connect to db ${error}`});
        process.exit(1);
    };
    
}

module.exports = ConnectDB;