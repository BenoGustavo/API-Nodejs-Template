import mongoose from 'mongoose';
import { DuplicateKeyError, ValidationError, DatabaseError } from './DatabaseErrors';
import { InvalidIdError } from '../InvalidIdError';
import { NotFound } from '../http/NotFound';

/**
 * Factory function to handle database errors
 * @param {Error} error
 * @returns {Error}
 */
export function adaptMongooseError(error) {
    if (error instanceof mongoose.Error.ValidationError) {
        return new ValidationError(error.message);
    } else if (error.code && error.code === 11000) {
        return new DuplicateKeyError('Duplicate key error');
    } else if (error instanceof mongoose.Error.CastError) {
        return new InvalidIdError(`Invalid attribute ${error.path}: ${error.kind}`);
    } else if (error instanceof mongoose.Error.DocumentNotFoundError) {
        return new NotFound('Document not found');
    } else {
        console.error(
            "\nGeneric error occurred while processing a database operation:\n" +
            error +
            "\n"
        );
        return new DatabaseError('Database error');
    }
}