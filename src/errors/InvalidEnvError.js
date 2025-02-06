export class InvalidEnvError extends Error {
    constructor(message) {
        super(message);
        this.name = 'Invalid Environment Variable Error';
        this.code = 500;
        this.cause = 'You are missing some environment variables, please check your .env file';
    }
}