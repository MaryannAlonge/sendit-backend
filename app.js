import express from "express";
const app = express();
import cors from "cors";
import path from "path";
import  routes from "./routes"
const __dirname = path.resolve();

//middleware
app.use(cors());
app.use(express.json());
//routes
// app.use(express.static(__dirname + "/frontend"));

// register and login routes

app.use("/auth", routes)


// parcel routes

// app.use("/parcels", routes)

app.listen(5000, () => {
  console.log("server is running on port 5000!!");
});

export default app;
