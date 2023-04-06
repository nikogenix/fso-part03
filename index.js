const express = require("express");
const app = express();
const cors = require("cors");

app.use(express.static("build"));
app.use(express.json());
app.use(cors());

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

app.get("/api/persons/:id", (req, res, next) => {
	Person.findById(req.params.id)
		.then((person) => {
			if (person) res.json(person);
			else res.status(404).end();
		})
		.catch((err) => next(err));
});

app.get("/info", (req, res) => {
	const time = new Date();
	const count = Person.countDocuments({}).then((count) =>
		res.send(`<p>Phonebook has info for ${count} people<p/>
	<i>${time}<i/>`)
	);
});

app.delete("/api/persons/:id", (req, res, next) => {
	Person.findByIdAndRemove(req.params.id)
		.then((result) => res.status(204).end())
		.catch((err) => next(err));
});

app.post("/api/persons", (req, res, next) => {
	const name = req.body.name;
	const number = req.body.number;

	if (name === undefined || number === undefined) {
		return response.status(400).json({ error: "name and number fields are mandatory" });
	}

	const person = new Person({
		name,
		number,
	});

	person
		.save()
		.then((person) => res.json(person))
		.catch((err) => next(err));
});

app.put("/api/persons/:id", (req, res, next) => {
	const { name, number } = req.body;

	const person = {
		name,
		number,
	};

	Person.findByIdAndUpdate(req.params.id, person, { new: true, runValidators: true, context: "query" })
		.then((person) => res.json(person))
		.catch((err) => next(err));
});

const unknownEndpoint = (request, response) => {
	response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (err, req, res, next) => {
	if (err.name === "CastError") return res.status(400).send({ error: "malformatted id" });
	else if (err.name === "ValidationError") return res.status(400).json({ err: err.message });

	next(err);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
