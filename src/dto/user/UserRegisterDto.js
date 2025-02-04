export class UserRegisterDto {
    constructor(username, email, password, confirmPassword) {
        this.username = username;
        this.email = email;
        this.password = password
        this.confirmPassword = confirmPassword;
    }
}