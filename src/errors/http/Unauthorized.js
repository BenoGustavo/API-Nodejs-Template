export class Unauthorized extends Error {
    constructor(message) {
        super(message);
        this.code = 401;
        this.name = 'Unauthorized';
        this.cause = 'You might not have the necessary permissions to access this resource.';
        this.image = 'https://http.cat/401';
    }
}