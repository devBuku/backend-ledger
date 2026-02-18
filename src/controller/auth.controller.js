const User = require("../models/user.model");
const generateToken = require("../lib/utils");

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
            generateToken(newUser._id, res);
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
    } catch (error) {}
}

module.exports = { registerUserController };
