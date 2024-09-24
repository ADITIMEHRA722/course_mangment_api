
import jwt from 'jsonwebtoken';
import  {User}  from '../models/userModel.js'; 
const auth = async (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(400).json({ success: false, message: "Invalid token" });
    }
};

export default auth;


