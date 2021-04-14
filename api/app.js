var express = require("express");
var bodyParser = require('body-parser')
var mongoose = require('mongoose');
const path = require("path");

var userRouter = require("./routes/user");
var testAPIRouter = require("./routes/testAPI");
var schoolRouter = require("./routes/school");
var eventRouter = require("./routes/event");
var rsoRouter = require("./routes/rso");




var app = express();
const port = 5000;

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://db:pass@cluster0.v0yhs.mongodb.net/ucfeventtracker", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }).then(
	() => { console.log("connected") },
	err => { console.log("err", err); }
);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/users", userRouter);
app.use("/api/testAPI", testAPIRouter);
app.use("/api/school", schoolRouter);
app.use("/api/rso", rsoRouter);
app.use("/api/event", eventRouter);

// app.use(express.static("public"));

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
