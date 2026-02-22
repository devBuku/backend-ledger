const User = require("../models/user.model");
const utils = require("../lib/utils");

/**
- user register controller
- POST /api/v1/auth/register
*/

async function registerUserController(req, res) {
    try {
        const { email, name, password } = req.body;

        if (!email || !password || !name) {
            return res.status(400).json({ message: `All fields are required` });
        }

        const isExists = await User.findOne({ email });

        if (isExists) {
            return res.status(409).json({
                message: `User already exists with this email`,
                success: false,
            });
        }

        const newUser = new User({
            email,
            name,
            password,
        });

        if (newUser) {
            await newUser.save();
            utils.generateToken(newUser._id, res);
            res.status(201).json({
                user: {
                    _id: newUser._id,
                    email: newUser.email,
                    name: newUser.name,
                },
                success: true,
            });
        } else {
            return res
                .status(400)
                .json({ message: `Invalid user data`, success: false });
        }
    } catch (error) {
        console.log(`Error in Authentication Controller: ${error}`);
        return res.status(500).json({ message: `Internal Server Error` });
    }
}

/**
- user login controller
- POST /api/v1/auth/login
*/

async function loginUserController(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select("+password");
        if (!user) {
            return res
                .status(401)
                .json({ message: `Invalid email or password` });
        }
        const isValidPassword = user.comparePassword(password);
        if (!isValidPassword) {
            return res
                .status(401)
                .json({ message: `Invalid email or password` });
        }
        utils.generateToken(user._id, res);
        res.status(200).json({
            message: `User logged in successfully`,
            user: {
                _id: user._id,
                email: user.email,
                name: user.name,
            },
        });
    } catch (error) {
        console.log(`Error in Login User Controller: ${error}`);
        res.status(500).json({ message: `Internal Server Error` });
    }
}

module.exports = { registerUserController, loginUserController };
