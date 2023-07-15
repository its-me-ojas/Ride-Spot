const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));


app.get("/", function(req, res) {
  res.render("intro");
})
app.post("/", function(req, res) {
  res.redirect("/home");
})
app.get("/signup", function(req, res) {
  res.render("signup");
})
app.post("/signup", function(req, res) {
  const firstName = req.body.fName;
  const lastName = req.body.lName
  const email = req.body.email;

  if (!firstName || !lastName || !email) {
    res.redirect("failure");
    return;
  }

  var data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName
        }
      }
    ],
    update_existing: false
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us21.api.mailchimp.com/3.0/lists/f1b03aefd8";
  const options = {
    method: "POST",
    auth: "crest:cantposttheapikeyitgetsrevokedlol-us21"
  }

  const request = https.request(url, options, function(response) {
    console.log(response.statusCode);
    if (response.statusCode === 200)
      res.render("success");
    else
      res.render("failure");
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })
  request.write(jsonData);
  request.end();
})
app.get("/home", function(req, res) {
  res.render("home");
})
app.post("/home", function(req, res) {
  const buttonValue = req.body.button;
  console.log(buttonValue);
  if (buttonValue === "signup") {
    res.redirect("/signup");
  }
  else if (buttonValue === "login") {
    res.redirect("/login");
  }
})
app.get("/success", function(req, res) {
  res.render("success");
})

app.post("/success", function(req, res) {
  res.redirect("/home");
})

app.get("/failure", function(req, res) {
  res.render("failure");
})

app.post("/failure", function(req, res) {
  res.redirect("/signup");
})

app.get("/features", function(req, res) {
  res.render("features");
})

app.get("/pricing", function(req, res) {
  res.render("pricing");
})

app.listen(3000, function(req, res) {
  console.log("server is running");
})
