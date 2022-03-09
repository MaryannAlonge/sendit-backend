import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const tokenGenerator = (user, callback) => {
    jwt.sign(
        {
            id: user.id,
            email:user.email,
            firat_name:user.first_name,
            password: user.password,
            role: user.role
        },
        process.env.jwtSecret,
        {expiresIn: "24h"},
        (err, res) =>{
            callback(err, res)
        }
    );
};

export const authorizeUser = (req, res, next) => {
    const token = req.headers.authorization || req.headers["x-access-token"] || req.body.token;
    if(token) {
        jwt.verify(token, process.env.jwtSecret, (err, decoded) => {
            if(err) {
                res.send(err);
             } else {
                    req.decoded = decoded;
                    next()
                }
            });
    } else {
        res.status(401).json({
            status: "Failed",
            message: "Authentication required for this route"
        });
    }
};