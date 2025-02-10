import mongoose from "mongoose";

let databaseUri;

if (process.env.NODE_ENV === "prod") {
	if (!process.env.PROD_DATABASE_CONNECTION_STRING) {
		console.error("PROD_DATABASE_CONNECTION_STRING is not set. Exiting...");
		process.exit(1);
	}
	databaseUri = process.env.PROD_DATABASE_CONNECTION_STRING;
}

if (process.env.NODE_ENV === "development") {
	if (
		process.env.DATABASE_HOST === "" ||
		process.env.DATABASE_PORT === "" ||
		process.env.DATABASE_NAME === ""
	) {
		console.error("Env not configured for development is not set. Exiting...");
		process.exit(1);
	}
	databaseUri = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
}

console.log(`Connecting to database at ${databaseUri} 🛜🛜`);

mongoose
	.connect(databaseUri)
	.then(() => console.log("\nConnected to MongoDB successfully 🐳🐳\n"))
	.catch((err) => console.error("Could not connect to MongoDB:", err));
