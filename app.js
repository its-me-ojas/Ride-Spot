const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const ejs = require("ejs");


const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static("public"));

const welcome = ["Welcome to RideSpot!", "Thank you for signing up! Get ready for an incredible ride-sharing experience with RideSpot. Stay tuned for exciting offers, exclusive deals, and the latest updates on our app's features. Buckle up and enjoy the journey!", "Get Started"];
const emails = [];
const messageSentToMe = [];

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
      res.render("success", {
        first: welcome[0],
        second: welcome[1],
        third: welcome[2]
      });
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
  const email = req.body.email;

  if (!emails.includes(email)) {
    emails.push(email);
    console.log(email);

    res.render("success", {
      first: "Thank You for Subscribing!",
      second: "Welcome to our newsletter community. You will now receive the latest updates, news, and exclusive offers directly to your inbox.",
      third: "Return to Home Page"
    });
  }
  else {
    res.render("success", {
      first: "Thank you for your continued support! You are already subscribed to our newsletter.",
      second: "Stay tuned for the latest updates, news, and exclusive offers directly in your inbox.",
      third: "Return to Home Page"
    });
  }
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

app.get("/contact", function(req, res) {
  res.render("contactMe");
})

app.post("/contact", function(req, res) {
  const name = req.body.name;
  const email = req.body.email;
  const message = req.body.message;
  const messageContact = {
    name: name,
    email: email,
    message: message
  }
  messageSentToMe.push(messageContact);
  console.log(messageSentToMe);
})








app.listen(3000, function(req, res) {
  console.log("server is running");
})










