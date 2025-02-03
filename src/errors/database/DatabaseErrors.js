export class DuplicateKeyError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DuplicateKeyError';
        this.code = 409; // Bad Request
    }
}

export class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
        this.code = 422; // Unprocessable Entity
    }
}

export class DatabaseError extends Error {
    constructor(message) {
        super(message);
        this.name = 'DatabaseError';
        this.code = 500; // Internal Server Error
    }
}