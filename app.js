// require express and declare the app
const express = require("express");
const app = express();
//require body parser and declare it
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));
//https
const https = require("https");

//request
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

//response to sign up
app.post("/", function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
    key: "9ec6ce7a8196890b8f4473e512f56bb8-us17",
    email_address: email,
    status: "subscribed",
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
    },
  };

  const jsonData = JSON.stringify(data);

  const url = "https://us17.api.mailchimp.com/3.0/lists/8f23a7ed9b/members/";

  const options = {
    method: "POST",
    auth: "GT:9ec6ce7a8196890b8f4473e512f56bb8-us17",
  };

  const request = https.request(url, options, function (response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/public/success.html");
    } else {
      res.sendFile(__dirname + "/public/failure.html");
    }
    response.on("data", function (data) {
      console.log(JSON.parse(data));
    });
  });
  request.write(jsonData);
  request.end();
});

//response to failure
app.post("/failure", function (req, res) {
  res.redirect("/");
});
//bring in needed files
app.use(express.static(__dirname + "/public"));

app.listen(process.env.PORT || 3000, function () {
  console.log("This server is live at port 3000");
});
