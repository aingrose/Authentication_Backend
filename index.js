import express from "express"
import { MongoClient } from "mongodb"
import "dotenv/config"
import cors from 'cors';
import { UserRouter } from "./Routes/Users.js";
import { ProfileRouter } from "./Routes/Profile.js";


let app = express()

app.use(express.json())



app.use(cors());

const createConnection = async ()=> {
    try{ 
        let client = new MongoClient(process.env.MONGODB_URL)
        await client.connect()
        console.log("Mongodb is connected");
        return client
    }
    catch(error){
        console.log(error)


    }
  
} 


export const client = await createConnection()


app.use("/users",UserRouter)

 app.use("/profile",ProfileRouter)

// app.use("/image",imageRoute)




const port = process.env.PORT || 3000;
app.listen(port,()=>console.log(`port is lisiening on ${process.env.PORT}`))