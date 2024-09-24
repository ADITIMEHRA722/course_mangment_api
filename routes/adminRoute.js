
import express from 'express';
import { User } from '../models/userModel.js';  // Correct relative path
import adminAuth from "../middleware/adminAuth.js";
import auth from "../middleware/auth.js"
const router = express.Router();

router.post('/users/:userId/custom-fields', auth ,adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;
        const { title, field_type } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Add the custom field
        const newCustomField = {
            title,
            field_type
        };
        user.custom_fields.push(newCustomField);

        // Save the updated user data
        await user.save();

        res.status(200).json({ success: true, message: "Custom field added successfully", data: user });
    } catch (error) {
        console.error("Error:", error); // Log the error
        res.status(500).json({ success: false, message: "Error adding custom field", error: error.message });
    }
});

// Fetch All Custom Fields (GET)
// Get full user data with custom fields for a specific user (GET)
router.get('/users/:userId/custom-fields',auth ,adminAuth, async (req, res) => {
    try {
        const { userId } = req.params;

        // Find the user by ID and include custom fields
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Return the full user data including custom fields
        res.status(200).json({
            success: true,
            message: "User data and custom fields retrieved successfully",
            data: user // This contains all user data including custom fields
        });
    } catch (error) {
        console.error("Error:", error); // Log the error
        res.status(500).json({ success: false, message: "Error retrieving user data", error: error.message });
    }
});



// Update a specific custom field and user data  (PUT)
router.put('/users/:userId/custom-fields/:fieldId',auth ,adminAuth, async (req, res) => {
    try {
        const { userId, fieldId } = req.params;
        const { 
            first_name, last_name, email, mobile_number, age, dob, 
            address, highest_education, current_job, profile_picture, 
            title, field_type // Destructure title and field_type from req.body
        } = req.body;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Update user data if provided
        if (first_name) user.first_name = first_name;
        if (last_name) user.last_name = last_name;
        if (email) user.email = email;
        if (mobile_number) user.mobile_number = mobile_number;
        if (age) user.age = age;
        if (dob) user.dob = dob;
        if (address) user.address = address;
        if (highest_education) user.highest_education = highest_education;
        if (current_job) user.current_job = current_job;
        if (profile_picture) user.profile_picture = profile_picture;

        // Find the index of the custom field by ID
        const existingFieldIndex = user.custom_fields.findIndex(field => field._id.toString() === fieldId);

        if (existingFieldIndex === -1) {
            return res.status(404).json({ success: false, message: "Custom field not found" });
        }

        // Update the custom field with the new data
        user.custom_fields[existingFieldIndex] = {
            ...user.custom_fields[existingFieldIndex],
            title: title || user.custom_fields[existingFieldIndex].title,
            field_type: field_type || user.custom_fields[existingFieldIndex].field_type
        };

        // Save the updated user data
        await user.save();

        // Return the updated full user data, including custom fields
        res.status(200).json({
            success: true,
            message: "User and custom field updated successfully",
            data: user // Full user data including updated custom fields
        });
    } catch (error) {
        console.error("Error:", error); // Log the error
        res.status(500).json({ success: false, message: "Error updating user data and custom field", error: error.message });
    }
});



// Delete a specific custom field for a user (DELETE)
router.delete('/users/:userId/custom-fields/:fieldId',auth, adminAuth, async (req, res) => {
    try {
        const { userId, fieldId } = req.params;

        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Find the index of the custom field to delete
        const existingFieldIndex = user.custom_fields.findIndex(field => field._id.toString() === fieldId);

        if (existingFieldIndex === -1) {
            return res.status(404).json({ success: false, message: "Custom field not found" });
        }

        // Remove the custom field from the array
        user.custom_fields.splice(existingFieldIndex, 1);

        // Save the updated user data
        await user.save();

        // Return success message
        res.status(200).json({
            success: true,
            message: "Custom field deleted successfully",
            data: user // Full user data including remaining custom fields
        });
    } catch (error) {
        console.error("Error:", error); // Log the error
        res.status(500).json({ success: false, message: "Error deleting custom field", error: error.message });
    }
});



export default router;

