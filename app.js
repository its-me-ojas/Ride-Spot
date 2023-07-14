const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.send("Hello");

})

app.get("/signup", function(req, res) {
  res.render("signup")
})



app.listen(3000, function(req, res) {
  console.log("server is running");
})
