const express = require("express");
const app = express();

app.use(express.static(__dirname + "/public"));
app.use(express.json());

const people = [];

const getAllPeople = (req, res) => {
  res.json(people);
};

const getSinglePeople = (req, res) => {
  const peopleID = parseInt(req.params.id);
  if (!peopleID) {
    res.status(400).json({ error: "Please enter an ID." });
  } else {
    const result = people.find((person) => person.index === peopleID);
    if (!result) {
      res.status(404).json({ error: "No people with the entered ID." });
    } else {
      res.json(result);
    }
  }
};

const postPeople = (req, res) => {
  const { name, age } = req.body;
  const index = people.length + 1;
  if (!name) {
    res.status(400).json({ error: "Please enter a name." });
  } else if (!age || isNaN(age) || Number(age) < 1) {
    res.status(400).json({ error: "Please enter a valid age." });
  } else {
    people.push({ index, name: name, age: age });
    res.json({ msg: "A person record was added", index });
  }
};

app.post("/api/v1/people", postPeople);
app.get("/api/v1/people", getAllPeople);
app.get("/api/v1/people/:id", getSinglePeople);

const server = app.listen(3000, () => {
  console.log("listening on port 3000...");
});

module.exports = { app, server };
