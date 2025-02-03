export class InvalidIdError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidId';
        this.code = 400;
        this.cause = 'The provided ID is not a valid ObjectId';
    }
}