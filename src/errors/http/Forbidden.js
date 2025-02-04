export class Forbidden extends Error {
    constructor(message) {
        super(message);
        this.code = 403;
        this.name = 'Forbidden';
        this.cause = 'You do not have permission to access this resource';
        this.image = 'https://http.cat/403';
    }
}