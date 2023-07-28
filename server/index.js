const express = require("express");
const dotenv = require("dotenv");
const dbConnect = require("./config/dbConnect.js");
const authRoutes = require("./routes/auth.js");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware.js");
const cookieParser = require("cookie-parser");


/* CONFIGS */
const app = express();
dotenv.config();
dbConnect();


/* MIDDLEWARES */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


/* ROUTES */
app.get("/", (req, res) => {
    res.send("Hello from the server!")
});

app.use("/api/users", authRoutes);



/* ERROR MIDDLEWARES */
app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT : ${PORT}`);
});