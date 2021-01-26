require("dotenv").config();
let router = require("express").Router(); //here
let User = require("../db").import("../models/user"); //here
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");


router.post("/register", (req, res) => {
    User.create({
        username: req.body.username,
        passwordhash: bcrypt.hashSync(req.body.passwordhash, 10),
    })
    .then(
        function createSuccess(user){
            let token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60 * 60 * 24});
        res.json({
            user: user,
            message: "User successfully created!",
            sessionToken: token
        });
        })
    .catch(err => res.status(500).json({
        error: err
    }))
});

router.post("/login", (req, res) => {
    User.findOne({ where: { username: req.body.username } })
        .then((user) => {
            if (user === null) {
            return res.status(404).json({ message: "User not found!" });
        }
        bcrypt.compare(req.body.passwordhash, passwordhash, (err, matches) => {
            if (matches) {
            const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
              expiresIn: 60 * 60 * 24,
            });
            return res.status(200).json({ user, token });
            } else {
            return res.status(401).json({ message: "Wrong password!" });
            }
        });
    })
        .catch((error) => res.status(500).json(error));
});

module.exports = router;
