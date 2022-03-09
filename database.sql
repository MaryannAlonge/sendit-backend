CREATE DATABASE my_sendit;

--- create an extension

--- create users table
CREATE TABLE IF NOT EXISTS users(
     id serial PRIMARY KEY,
     first_name VARCHAR NOT NULL,                  
     last_name VARCHAR NOT NULL,
     email VARCHAR UNIQUE NOT NULL,
     phone_no VARCHAR NOT NULL,
     password VARCHAR NOT NULL,
     role VARCHAR DEFAULT 'member'
);


     --create parcels table

     CREATE TABLE IF NOT EXISTS parcels(
         id serial PRIMARY KEY,
         user_id INTEGER REFERENCES users(id),
         pickup_location VARCHAR NOT NULL,
         destination VARCHAR NOT NULL, 
         recipient_name VARCHAR NOT NULL,
         recipient_phone_no VARCHAR NOT NULL,
         status VARCHAR DEFAULT 'pending'
     );