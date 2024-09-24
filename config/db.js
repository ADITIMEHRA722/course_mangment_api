import mongoose from "mongoose";

import dotenv from "dotenv";

// first of all we load env variavles 

dotenv.config();

// database connection function

const connectDB = async()=>{
    try{
        const dbUrl = process.env.MONGODB_URL;
        if(!dbUrl){
            throw new Error('Mongo db url is not defined')
        }

        await mongoose.connect(dbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true, 
            serverSelectionTimeoutMS: 5000,
          });
        console.log("Database is successfully connected");


    }catch(error){
        console.error('MongoDB connection error',error);
        process.exit(1);
    }
};

export default connectDB; 