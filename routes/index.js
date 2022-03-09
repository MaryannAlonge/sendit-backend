import express from "express";
import userRoute from './user-routes';
import parcelRoute from "./parcel-routes";

const app = express();

// app.use('/')
app.use('/', userRoute);
app.use('/', parcelRoute)

export default app;