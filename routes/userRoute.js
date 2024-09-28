
import express from 'express';
import {User} from '../models/userModel.js';  // Import User model
import jwt from "jsonwebtoken";
import auth from '../middleware/auth.js';


// Create a new express router
const router = express.Router();

// Create/Edit User Profile
// Create/Edit User Profile
router.post('/profile', async (req, res) => {
    const { first_name, last_name, email, mobile_number, age, dob, address, highest_education, current_job, profile_picture, role } = req.body;

    try {
        // Check if a user with the same email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        const user = new User({
            first_name, last_name, email, mobile_number, age, dob, address, highest_education, current_job, profile_picture, role 
        });

        await user.save();

        // Generate JWT token after user profile is created
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        // Save the token in the user document (if necessary)
        user.token = token;
        await user.save();

        // Send response including user ID
        res.status(201).json({ 
            success: true, 
            message: "User profile created", 
            userId: user._id, // Include user ID in the response
            token 
        });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});






// Fetch user profile by user ID including custom fields
router.get('/:user_id', auth, async (req, res) => {
    try {
        const user = await User.findById(req.params.user_id).lean();  // Fetch user by ID

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return user profile with custom fields
        return res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
});



// Update (PUT) User Profile
router.put('/update/:user_id', auth, async (req, res) => {
    const { first_name, last_name, email, mobile_number, age, dob, address, highest_education, current_job, profile_picture } = req.body;

    try {
        const formattedDob = dob ? new Date(dob).toISOString().slice(0, 10) : undefined;
        // Find and update the user profile by ID
        const user = await User.findByIdAndUpdate(req.params.user_id, {
            first_name, last_name, email, mobile_number, age, dob:formattedDob, address, highest_education, current_job, profile_picture
        }, { new: true });

        // If user not found, return 404 error
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Return the updated user data
        res.json({ success: true, message: "User profile updated", user });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Delete User Profile
router.delete('/delete/:user_id', auth, async (req, res) => {
    try {
        // Find and delete the user profile by ID
        const user = await User.findByIdAndDelete(req.params.user_id);

        // If user not found, return 404 error
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Return success message
        res.json({ success: true, message: "User profile deleted" });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Export the router for use in other parts of the app
export default router;
