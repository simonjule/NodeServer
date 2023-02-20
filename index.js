require("dotenv").config();
const jwt = require("jsonwebtoken");

const express = require("express");
const app = express();

/* This middleware function is used to verify 
the token before granting access to the user
to the protected endpoints. If the token is 
invalid it will restrict the user from
accessing the protected endpoints 
We can use this middleware to any endpoints 
that we desire to make as protected*/

const verifyTokenMiddleware = (req, res, next) => {
    const { token } = req.body;
    if (!token) return res.status(403).json({ 
        msg: "No token present" 
    });
    try {
        const decoded = jwt.verify(token, 
            process.env.JWT_SECRET_KEY);
        req.user = decoded;
    } catch (err) {
        return res.status(401).json({ 
            msg: "Invalid Token" 
        });
    }
    next();
};

app.use(express.json());
  
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "admin") {
        const token = jwt.sign({ username }, 
        process.env.JWT_SECRET_KEY, {
            expiresIn: 86400
        });
        return res.json({ username, token, msg: "Login Success" });
    }
    return res.json({ msg: "Invalid Credentials" });
});

// use the verifyTokenMiddleware
app.get("/home", verifyTokenMiddleware, (req, res) => {
    const { user } = req;
    res.json({ msg: `Welcome ${user.username}` });
});

app.listen(8080, () => console.log("Listening on 8080"));