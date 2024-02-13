const express = require('express')
const cookieParser = require('cookie-parser');
const routePost = require('./routes/postRoute');
const routeUser = require('./routes/userRoute');

const app = express();

//middleware
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

//routes
app.use("/api/v1", routePost)
app.use("/api/v1", routeUser)

module.exports = app;