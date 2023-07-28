const mongoose = require("mongoose");

const dbConnect = async () => {
    try {
        const MONGO_URL = process.env.MONGO_URL;
        const conn = await mongoose.connect(MONGO_URL);
        console.log("MONGODB CONNECTED!");
    } catch (error) {
        console.log({ error });
    }
};

module.exports = dbConnect;
