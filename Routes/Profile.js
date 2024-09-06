import express from "express";
import { auth } from "../Middleware/Auth.js"; 
import { updateProfile, getProfile,createProfile } from "../Helper.js"; 
const router = express.Router();

// Get Profile
router.get("/profile", auth, async (req, res) => {
    try {
   
        const profile = await getProfile(req.user.id);
        console.log("jj",profile)
        console.log("toke",req.user.id)
        if (!profile) {
            return res.status(404).send({ message: "Profile not found" });
        }
        res.status(200).json(profile);
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Update Profile

router.put('/update', auth, async (req, res) => {
    try {
        const { email,age, dob, contact,city } = req.body;
        const userId = req.user.id; 
        // Get the user ID from the token
       console.log("idss",userId) 

        // Fetch the current user profile from the database
        const currentProfile = await getProfile(userId);

        if (!currentProfile) {
            // If no profile is found, create a new one
            const result = await createProfile(userId,email, age, dob, contact,city);
            return res.json({ message: 'Profile created successfully', result });
        } else {
            // If profile exists, update it
            const result = await updateProfile(userId, email,age, dob, contact,city);
            return res.json({ message: 'Profile updated successfully', result });
        }
    } catch (error) {
        console.error('Error updating or creating profile:', error);
        res.status(500).json({ message: 'Error updating or creating profile', error: error.message });
    }
});

export const ProfileRouter = router;
