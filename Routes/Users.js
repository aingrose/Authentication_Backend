
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { genPassword, createUser, getUser } from "../Helper.js";
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { Username, Password } = req.body;

    const isUserExist = await getUser(Username);

    if (isUserExist) {
      return res.status(400).send({ message: "Username already exists" });
    }

    if (!/^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@!$%&_#]).{8,}$/g.test(Password)) {
      return res.status(400).json({ message: "Password doesn't meet criteria" });
    }

    const hashPassword = await genPassword(Password);
    await createUser(Username, hashPassword); // Added await here
    res.status(201).send({ message: "Successfully created" });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

router.post("/login", async (req, res) => {
  const { Username, Password } = req.body;
  try {
    const userFromDB = await getUser(Username);

    if (!userFromDB) {
      return res.status(401).send({ message: "Invalid Credentials" }); // 401 Unauthorized
    }

    const passwordFromDb = userFromDB.Password;
    const isMatch = await bcrypt.compare(Password, passwordFromDb);

    if (!isMatch) {
      return res.status(401).send({ message: "Invalid Credentials" }); // 401 Unauthorized
    }

    const token = jwt.sign({ id: userFromDB._id }, process.env.SECRET_KEY);
    return res.status(200).json({ message: "Successfully logged in", token });
  } catch (error) {
    console.log("Error", error);
    return res.status(500).send({ message: "Internal Server Error" });
  }
});

export const UserRouter = router;
