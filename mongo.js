// To add a new entry, run:
// node mongo.js NAME NUMBER
// To check the current entries, run:
// node mongo.js

const mongoose = require("mongoose");
require("dotenv").config();

const db = process.env.MONGODB_URI;

if (process.argv.length === 2) {
	mongoose.set("strictQuery", false);
	mongoose.connect(db);

	const personSchema = new mongoose.Schema({
		name: String,
		number: String,
	});

	const Person = mongoose.model("Person", personSchema);

	Person.find({}).then((result) => {
		result.forEach((person) => {
			console.log(person);
		});
		mongoose.connection.close();
	});
} else if (process.argv.length === 4) {
	mongoose.set("strictQuery", false);
	mongoose.connect(db);

	const personSchema = new mongoose.Schema({
		name: String,
		number: String,
	});

	const Person = mongoose.model("Person", personSchema);

	const person = new Person({
		name: process.argv[2],
		number: process.argv[3],
	});

	person.save().then((result) => {
		console.log(result);
		console.log("person added!");
		mongoose.connection.close();
	});
} else {
	console.error("you can use 2 arguments to add a new entry, or no arguments to check the phonebook");
	process.exit(1);
}
