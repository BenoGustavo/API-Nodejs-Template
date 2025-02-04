export class ServerError extends Error {
    constructor(message) {
        super(message);
        this.code = 500;
        this.name = 'ServerError';
        this.cause = 'Something went wrong, call the developers';
        this.image = 'https://http.cat/500';
    }
}