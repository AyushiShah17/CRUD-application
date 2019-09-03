const express = require("express");
const router = express.Router();
var bodyParser = require("body-parser");
const jade = require("jade");
const fs = require("fs");
const uuid = require("uuid");

router.post("/", function(request, response) {
  const newEntry = {
    id: uuid.v4(),
    Name: request.body.Name,
    Email: request.body.Email,
    Age: request.body.Age
  };
  if (!newEntry.Name || !newEntry.Email || !newEntry.Age) {
    response.render("error");
  }
  fs.readFile("fetchDetails.json", (err, data) => {
    if (data.length) {
      const fetchDetails = JSON.parse(data);
      fetchDetails.fetchDetails.push(newEntry);
      fs.writeFile(
        "fetchDetails.json",
        JSON.stringify(fetchDetails, null, 4),
        err => {
          if (err) throw err;
          else {
            var contents = fs.readFileSync("fetchDetails.json");
            var jsonContent = JSON.parse(contents);
            response.render("change", { jsonContent: jsonContent });
          }
        }
      );
    } else {
      const temp = {
        fetchDetails: [newEntry]
      };
      fs.writeFile("fetchDetails.json", JSON.stringify(temp, null, 4), err => {
        if (err) throw err;
        else {
          var contents = fs.readFileSync("fetchDetails.json");
          var jsonContent = JSON.parse(contents);
          response.render("change", { jsonContent: jsonContent });
        }
      });
    }
  });
});
router.post("/:id", (req, res) => {
  var contents = fs.readFileSync("fetchDetails.json");
  var jsonContent1 = JSON.parse(contents);
  for (var i = 0; i < jsonContent1.fetchDetails.length; i++) {
    if (jsonContent1.fetchDetails[i].id == req.params.id) {
      jsonContent1.fetchDetails[i].Name = req.body.Name;
      jsonContent1.fetchDetails[i].Age = req.body.Age;
      jsonContent1.fetchDetails[i].Email = req.body.Email;
    }
  }
  fs.writeFile(
    "fetchDetails.json",
    JSON.stringify(jsonContent1, null, 4),
    err => {
      if (err) throw err;
      else {
        var contents = fs.readFileSync("fetchDetails.json");
        var jsonContent = JSON.parse(contents);
        res.render("change", { jsonContent: jsonContent });
      }
    }
  );
});

// router.delete("/delete/:id", (request, response) => {
//   console.log("Entered");
//   let id = request.params.id;
//   let contacts = require("./fetchDetails");
//   let contact = contacts.filter(contact => {
//     return contact.Name == Name;
//   });

//   const index = contacts.indexOf(contact);

//   contacts.splice(index, 1);

//   response.json({ message: `User ${Name} deleted.` });
// });

module.exports = router;
