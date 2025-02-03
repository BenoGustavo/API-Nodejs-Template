export class BadRequest extends Error {
    constructor(message) {
        super(message);
        this.code = 400;
        this.name = 'BadRequest';
        this.cause = 'The server could not understand the request due to invalid syntax or information.';
    }
}