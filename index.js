const express = require("express");
const path = require("path");
const fs = require("fs");
var bodyParser = require("body-parser");
var addUser = require("./routes/addUser.js");

// const jade = require("jade");
const ejs = require("ejs");
const app = express();

var server = app.listen(3000, function() {
  console.log("Node server is running..");
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

app.get("/", function(req, res) {
  res.render("fetchDetails");
});
app.get("/addUser/:id", function(req, res) {
  console.log(req.params.id);
  var contents = fs.readFileSync("fetchDetails.json");
  var jsonContent = JSON.parse(contents);
  var myObj = {};
  for (var i = 0; i < jsonContent.fetchDetails.length; i++) {
    if (jsonContent.fetchDetails[i].id == req.params.id) {
      myObj.id = jsonContent.fetchDetails[i].id;
      myObj.Name = jsonContent.fetchDetails[i].Name;
      myObj.Age = jsonContent.fetchDetails[i].Age;
      myObj.Email = jsonContent.fetchDetails[i].Email;
    }
  }
  //console.log(myObj);
  res.render("edit", {
    myObj: myObj,
    put: true
  });
});

app.get("/addUser/delete/:id", function(req, res) {
  let deleteId = req.params.id;
  let data = fs.readFileSync("fetchDetails.json");
  let jsonContent1 = JSON.parse(data);
  let fetchDetails = jsonContent1.fetchDetails;
  console.log(fetchDetails);
  jsonContent1.fetchDetails = fetchDetails.filter(fetchDetails => {
    return fetchDetails.id !== deleteId;
  });
  fs.writeFileSync("fetchDetails.json", JSON.stringify(jsonContent1, null, 4));

  var contents = fs.readFileSync("fetchDetails.json");
  var jsonContent = JSON.parse(contents);
  res.render("change", { jsonContent: jsonContent });
});

app.use("/addUser", addUser);
module.exports = app;
