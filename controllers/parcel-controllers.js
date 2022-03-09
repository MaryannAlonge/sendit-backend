import { parse } from "dotenv";
import express, { response } from "express";
import { validationResult } from "express-validator";
import pool from "../db";

const app = express();

// CREATE PARCEL

export const createParcel = (req, res) => {
  const {
    user_id,
    pickup_location,
    destination,
    recipient_name,
    recipient_phone_no
  } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else if (req.decoded.id === parseInt(user_id, 10)) {
 
    pool.query(
      "INSERT INTO parcels  (user_id, pickup_location, destination, recipient_name, recipient_phone_no) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        user_id,
        pickup_location,
        destination,
        recipient_name,
        recipient_phone_no
      ],
      (err, result) => {
        if (err) {
          res.send(err);
          console.log(err)
        } else {
          res.send({
            success: true,
            msg: "Parcel created successfully!",
            id: result.rows[0].id
          });
        }
      }
    );
  } else {
    res
      .status(401)
      .send({ msg: "Sorry you can not create Parcel Order for another User!" });
  }
};




// get all parcels by a specific user

export const getAllParcels = (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({ errors: errors.array()});
  } else {
    const userId = parseInt(req.params.userId, 10);
    if(req.decoded.id === userId) {
      pool.query(`SELECT * FROM parcels WHERE user_id = ${userId}`, (err, resp) => {
        if(err) {
          res.send(err);
        } else if(!resp.rows.length) {
          res.status(404).send({ msg: 'You do not have any parcel order yet'});
        } else {
          res.send(resp.rows);
        }
      });
    } else{
      res
      .status(401)
      .send({ msg: 'Sorry you can not fetch parels for another user!'});
    }
  }
}

export const getParcels = (req, res) => {
  if (req.decoded.role !== "admin") {
    res.send({
      msg: "failed! Only admins can access this endpoint",
    });
  } else {
    pool.query("SELECT * FROM parcels", (err, resp) => {
      if (err) {
        console.log("sorry cant fetch data");
      } else {
        res.send(resp.rows);
      }
    });
  }
};


// change parcel destination

export const changeDestination = (req, res) => {
  const { parcelId, destination, user_id} = req.body;

  if(req.decoded.id === parseInt(user_id, 10)){
    pool.query("UPDATE parcels SET destination = $2 WHERE id = $1 AND user_id = $3 RETURNING *",
    [parcelId, destination, user_id], (err, results) => {
       if(err) {
         res.send(err);
       } else if(!results.rows[0]) {
         res.send({
           msg: 'You can not change Destination for another User!'
         })
       } else{
         res.send({
           success: true,
           msg: "Destination changed successfully",
           details: results.rows[0]
         });
       }
    })
  } else {
    res.send("Sorry! You cant change the destination for another user's parcel")
  }
}

export const changeStatus = (req, res) => {
  const { status, parcelId } = req.body;
  if (req.decoded.role !== "admin") {
    res.send({
      msg: "failed! Only admins can access this endpoint",
    });
  } else {
    pool.query(
      "UPDATE parcels SET status = $1 WHERE id = $2 RETURNING *",
      [status, parcelId],
      (err, results) => {
        if (err) {
          res.send(err);
        } else {
          res.send({
            msg: "status changed successfully",
            details: results.rows[0],
          });
        }
      }
    );
  }
};



// change parcel order location by admin

export const changeLocation = (req, res) => {
  const { presentLocation, parcelId } = req.body;
  if (req.decoded.role !== "admin") {
    res.send("only admins can change the present location");
  } else {
    pool.query(
      "UPDATE parcels SET pickup_location = $1 WHERE id = $2 RETURNING *",
      [presentLocation, parcelId],
      (err, updatedLocation) => {
        if (err) {
          res.send(err);
          console.log(err);
        } else {
          res.send({
            msg: "location updated successfully!!!",
            details: updatedLocation.rows[0]
          });
        }
      }
    );
  }
};

export const cancelParcel = (req, res) => {
  const { parcelId, user_id } = req.body;

  if(req.decoded.id === parseInt(user_id, 10)) {
    pool.query("UPDATE parcels SET status = 'cancelled' WHERE id = $1 AND user_id = $2 RETURNING *",
    [parcelId, user_id], (err, results) => {
      if(err) {
        res.send(err);
        console.log(err)
      } else if(!results.rows[0]) {
        res.send({
          msg: "You can not cancel another user's parcel"
        })
      } else {
        res.send({
          success: true,
          msg: "Parcel cancelled successfully",
          details: results.rows[0]
        });
      }
    })
  } else {
    res.send("Sorry! You can't cancel parcel for another user");
  }
}