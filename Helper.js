
import bcrypt from "bcrypt"
import { client } from "./index.js"
import { ObjectId } from "mongodb"; 

const genPassword = async (Password) =>{
    const salt =  await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(Password,salt)
    return hashPassword
}


const createUser = async (Username,Password) =>{
    return await client.db("Authentication").collection("Users").insertOne({Username:Username,Password:Password})
}
 
const getUser = async (Username) => {
    return await client.db("Authentication").collection("Users").findOne({Username:Username})
}

// Function to update profile
const updateProfile = async (userId,email, age, dob, contact,city) => {
    try {
        const filter = {_id: new ObjectId(userId)};
        const updateDoc = {
            $set: {
                email:email,
                age: age,
                dob: dob,
                contact: contact,
                city:city
            }
        };
        const options = { upsert: false };  // Only update existing user

        const result = await client.db("Authentication").collection("Users").updateOne(filter, updateDoc, options);
        return result;
    } catch (error) {
        console.error("Error updating profile:", error);
        throw error;
    }
};

// Function to fetch user profile by userId
const getProfile = async (userId) => {
    try {
        const profile = await client.db("Authentication").collection("Users").findOne({ _id:new ObjectId(userId)  });
        return profile;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};



const createProfile = async (userId,email, age, dob, contact,city) => {
    try {
        const filter = { _id: new ObjectId(userId) };  // Match user by _id
        const newProfile = {
            $set: {
                email:email,
                age: age,
                dob: dob,
                contact: contact,
                city:city
            }
        };

        const options = { upsert: true };  // Create new if it doesn't exist
        const result = await client.db("Authentication").collection("Users").updateOne(filter, newProfile, options);
        return result;
    } catch (error) {
        console.error("Error creating profile:", error);
        throw error;
    }
};



export {genPassword ,createUser,getUser,updateProfile,getProfile,createProfile}