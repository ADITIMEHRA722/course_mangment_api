import express from"express";
import connectDB from "./config/db.js";
import dotenv  from "dotenv";

dotenv.config();

const app = express();

connectDB();

// add middleware

app.use(express.json({extended: false}));

const PORT = process.env.PORT || 5000; 
app.listen(PORT, ()=> console.log(`server running on ${PORT}`));