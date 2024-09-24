// import express from"express";
// import connectDB from "./config/db.js";
// import dotenv  from "dotenv";
// import userRoute from "./routes/userRoute.js";
// import adminRoute from "./routes/adminRoute.js";
// import courseRoute from "./routes/courseRoute.js";
// import cors from "cors";  

// dotenv.config();

// const app = express();
// app.use(cors());
// connectDB();

// // add middleware

// app.use(express.json({extended: false}));

// app.use('/api/user', userRoute);
// app.use('/api/admin', adminRoute);
// app.use('/api/course', courseRoute)

// const PORT = process.env.PORT || 6000; 
// app.listen(PORT, ()=> console.log(`server running on ${PORT}`));
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";  // Your DB connection file
import dotenv from "dotenv";
import userRoute from "./routes/userRoute.js";
import adminRoute from "./routes/adminRoute.js";
import courseRoute from "./routes/courseRoute.js";

dotenv.config();

const app = express();

// Basic CORS setup to allow all origins (for debugging)
app.use(cors());  // Allow all origins by default

// Middleware to parse incoming JSON requests
app.use(express.json());

// Connect to the database
connectDB();

// API Routes
app.use('/api/user', userRoute);
app.use('/api/admin', adminRoute);
app.use('/api/course', courseRoute);

// Start the server
const PORT = process.env.PORT || 6000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
