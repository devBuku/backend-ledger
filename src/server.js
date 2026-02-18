require("dotenv").config();
const app = require("./app");
const connectToDb = require("./config/db");

const port = process.env.PORT || 3000;

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err.message);
    process.exit(1);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err.message);
    process.exit(1);
});

async function startServer() {
    try {
        await connectToDb();
        app.listen(port, function () {
            console.log(`Server is listening to port: ${port}`);
        });

        process.on("SIGTERM", async () => {
            console.log("SIGTERM received. Shutting down gracefully...");
            await mongoose.connection.close();
            server.close(() => {
                console.log("Process terminated");
            });
        });
    } catch (error) {
        console.log(`Error in starting the server: ${error}`);
        process.exit(1);
    }
}

startServer();
