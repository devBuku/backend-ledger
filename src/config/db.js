const mongoose = require("mongoose");

async function connectToDb() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB connected:${conn.connection.host}`);
    } catch (error) {
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);
    }
    mongoose.connection.on("disconnected", () => {
        console.error("MongoDB disconnected!");
    });
    mongoose.connection.on("reconnected", () => {
        console.log("MongoDB reconnected!");
    });
}
module.exports = connectToDb;
