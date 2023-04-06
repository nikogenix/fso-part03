const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors());

app.use(express.json());

app.use(express.static("build"));

require("dotenv").config();

const Person = require("./models/person");

const morgan = require("morgan");

morgan.token("content", function (req, res) {
	if (req.method === "POST") return JSON.stringify(req.body);
});

app.use(
	morgan(function (tokens, req, res) {
		return [
			tokens.method(req, res),
			tokens.url(req, res),
			tokens.status(req, res),
			tokens.res(req, res, "content-length"),
			"-",
			tokens["response-time"](req, res),
			"ms",
			tokens["content"](req, res),
		].join(" ");
	})
);

app.get("/api/persons", (req, res) => {
	Person.find({}).then((person) => {
		res.json(person);
	});
});

app.get("/api/persons/:id", (req, res) => {
	Person.findById(req.params.id).then((person) => res.json(person));
});

app.get("/info", (req, res) => {
	const count = persons.length;
	const time = new Date();
	res.send(`<p>Phonebook has info for ${count} people<p/>
    <i>${time}<i/>`);
});

app.delete("/api/persons/:id", (req, res) => {
	const person = persons.find((p) => p.id === Number(req.params.id));
	if (person) {
		persons = persons.filter((p) => p.id !== Number(req.params.id));
		res.status(204).end();
	} else {
		res.status(404).end();
	}
});

app.post("/api/persons", (req, res) => {
	const name = req.body.name;
	const number = req.body.number;

	if (name === undefined || number === undefined) {
		return response.status(400).json({ error: "name and number fields are mandatory" });
	}

	const person = new Person({
		name,
		number,
	});

	person.save().then((person) => res.json(person));
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
