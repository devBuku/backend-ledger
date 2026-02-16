require("dotenv").config();
const app = require("./app");
const connectToDb = require("./config/db");

const port = process.env.PORT || 3000;

async function startServer() {
    try {
        await connectToDb();
        app.listen(port, () => {
            console.log(`Server is listening to port: ${port}`);
        });
    } catch (error) {
        console.log(`Error in starting the server: ${error}`);
        process.exit(1);
    }
}

startServer();
