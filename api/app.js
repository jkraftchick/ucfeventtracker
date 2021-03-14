var express = require("express");
var bodyParser = require('body-parser')
var mongoose = require('mongoose');

var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var testAPIRouter = require("./routes/testAPI");

var app = express();
const port = 5000;

app.use(bodyParser.json());


mongoose.connect("mongodb+srv://db:pass@cluster0.v0yhs.mongodb.net/ucfeventtracker").then(
	() => { console.log("connected") },
	err => { console.log("err", err); }
);


app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/testAPI", testAPIRouter);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
