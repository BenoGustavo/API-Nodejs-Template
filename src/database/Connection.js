import mongoose from 'mongoose';

const databaseUri = `mongodb://${process.env.DATABASE_HOST}:${process.env.DATABASE_PORT}/${process.env.DATABASE_NAME}`;
console.log(`Connecting to database at ${databaseUri} 🛜🛜`);

mongoose.connect(databaseUri)
    .then(() => console.log('\nConnected to MongoDB successfully 🐳🐳\n'))
    .catch(err => console.error('Could not connect to MongoDB:', err));