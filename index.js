const express = require("express");
const app = express();

app.use(express.json());

let persons = [
	{
		id: 1,
		name: "Arto Hellas",
		number: "040-123456",
	},
	{
		id: 2,
		name: "Ada Lovelace",
		number: "39-44-5323523",
	},
	{
		id: 3,
		name: "Dan Abramov",
		number: "12-43-234345",
	},
	{
		id: 4,
		name: "Mary Poppendieck",
		number: "39-23-6423122",
	},
];

app.get("/api/persons", (req, res) => {
	res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
	const person = persons.find((p) => p.id === Number(req.params.id));
	if (person) {
		res.json(person);
	} else {
		res.status(404).end();
	}
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
	const nameDupe = persons.filter((p) => p.name === name).length > 0 ? true : false;
	const numberDupe = persons.filter((p) => p.number === number).length > 0 ? true : false;
	const id = parseInt(Math.random() * 123456789);

	console.log(name, number, nameDupe, numberDupe);

	if (!name || !number) {
		return res.status(400).json({ error: "missing info. submitting a name and number is mandatory" }).end();
	}

	if (nameDupe || numberDupe) {
		return res.status(400).json({ error: "duplicate entry. name and number must be unique" }).end();
	}

	const person = {
		id,
		name,
		number,
	};

	persons = persons.concat(person);

	res.json(person);
});

const PORT = 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
