const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: [true, "Email is required for creating an user"],
            trim: true,
            lowercase: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                "Please fill a valid email address",
            ],
            unique: [true, "Email already exists"],
        },
        name: {
            type: String,
            required: [true, "Name is required for creating a new account"],
        },
        password: {
            type: String,
            required: [true, "Password is required for creating a new account"],
            minlength: [6, "Password must be at least 6 characters long"],
            select: false,
        },
    },
    { timestamps: true },
);

userSchema.pre("save", async function () {
    try {
        if (!this.isModified("password")) {
            return;
        }
        const hash = await bcrypt.hash(
            this.password,
            Number(process.env.SALT_ROUND),
        );
        this.password = hash;
        return;
    } catch (error) {
        console.log(`Error in User Model hashing password: ${error}`);
    }
});

userSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
