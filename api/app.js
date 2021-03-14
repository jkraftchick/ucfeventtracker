var express = require("express");

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var testAPIRouter = require("./routes/testAPI");

var app = express();
const port = 5000




app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/testAPI", testAPIRouter);

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})

module.exports = app;
