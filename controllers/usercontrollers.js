import express from "express";
import { validationResult } from "express-validator";
import { tokenGenerator } from "../middlewares/auth";
import bcrypt from "bcrypt";
import pool from "../db";

// CREATE USER



export const createUser = async (req, res) => {
  const { first_name, last_name, email, phone_no, password } = req.body;

  //bcrypt user password
  const salt = await bcrypt.genSalt(10);
  const bcryptPassword = await bcrypt.hash(password, parseInt(salt));



  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    pool.query(
      "INSERT INTO users (first_name, last_name, email, phone_no, password) VALUES($1, $2, $3, $4, $5) RETURNING *",
      [first_name, last_name, email, phone_no, bcryptPassword],
      (err, user) => {
        if (err) {
          res.send({ msg: err.detail });
        } else {
          tokenGenerator(user.rows[0], (err, token) => {
            if (err) {
              res.send("unable to encode token");
            } else {
              res.status(201).send({
                success: true,
                msg: "Registered successfully!",
                userId: user.rows[0].id,
                token,
                expiresIn: "24hours",
              });
            }
          });
        }
      }
    );
  }
};




// User login

export const  userLogin = async(req, res) => {
  try {
    // destructure the req.body

    const { email, password } = req.body;

    // check if user exists, if not throw up error

    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid email");
    }

    // check if password correlates

    const validPassword = await bcrypt.compare(
      password,
      user.rows[0].password
    );

    if (!validPassword) {
      return res.status(401).json("Incorrect Password");
    } else if (user.rows.length) {
      tokenGenerator(user.rows[0], (err, token) => {
        if(err) {
          res.send({msg: "Unable to encode token"});
        } else{
          res.send({
            msg: "Login successful",
            userId: user.rows[0].id,
            token,
            expiresIn: "24hours"
          });
        }
      });
    } else{
      res.send({
        success: false,
        msg: "Incorrect email or password"
      });
    }
  } catch (error) {
    
  }
}


// Get a User

export const getUser = (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    res.status(422).json({erros: errors.array() });
  } else{
    pool.query(
      `SELECT * FROM users WHERE ID = ${req.decoded.id}`,
      (err, resp) => {
        if (err) {
          res.status(500).send(err);
        } else{
          console.log(resp.rows[0]);
          res.status(200).send(resp.rows[0]);
        }
      }
    )
  }
}