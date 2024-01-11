const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
const mongoose = require('mongoose');
const placeRouter = require('./routes/place');
const authRouter = require("./service/login");
const rideRouter = require("./service/ride");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
rideRouter.use(cookieParser)
app.use(cors({
    origin: 'http://127.0.0.1:5500',  // Update this to match your frontend's origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

app.use((req, res, next) => {
    console.log("\n", req.url);
    res.header("Access-Control-Allow-Credentials");
    next();
});

mongoose.connect('mongodb+srv://root:root@cluster0.vzhfshx.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.listen(8080, () => {
    console.log(`Listening at port: ${8080}`);
});

app.use('/places', placeRouter);
app.use(authRouter)
app.use(rideRouter)
