export class UserResetPasswordDto {
    constructor(password,confirmPassword ,resetPasswordToken) {
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.resetPasswordToken = resetPasswordToken;
    }
}