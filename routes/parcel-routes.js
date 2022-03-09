import express from "express";
import { createParcel, getAllParcels, changeLocation,  getParcels, changeDestination, changeStatus, cancelParcel} from "../controllers/parcel-controllers";
import { authorizeUser } from "../middlewares/auth"

const app = express();

// create a parcel delivery order

app.post("/parcels", authorizeUser, createParcel);
app.get("/parcels", authorizeUser, getParcels);

// fetch all parcel delivery orders by a specific user
app.get("/:userId/parcels", authorizeUser, getAllParcels);

// change destination of an order

app.patch("/parcels/destination", authorizeUser, changeDestination);

//change the status of an order 
app.patch("/parcels/status",authorizeUser, changeStatus);

//change the present location of an order
app.patch("/parcels/location", authorizeUser, changeLocation);


// cancel parcel
app.patch("/parcels/cancel", authorizeUser, cancelParcel)


export default app;