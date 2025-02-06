import nodemailer from "nodemailer";
import { InvalidEnvError } from "../errors/InvalidEnvError";

/**
 * This class represents an email object
 *
 * You can create an email object using the EmailSender.createNewEmail method
 * But you can also create an email object manually using this class caller
 */
export class Email {
	/**
	 *
	 * @param {string} to
	 * @param {string} subject
	 * @param {string} text
	 * @param {string} html
	 */
	constructor(to, subject, text, html) {
		this.to = to;
		this.subject = subject;
		this.text = text;
		this.html = html;
	}
}

/**
 * This class is responsible for sending emails, and creating email objects
 */
class EmailSender {
	#SMTP_HOST = process.env.SMTP_HOST;
	#SMTP_PORT = process.env.SMTP_PORT;
	#SMTP_USERNAME = process.env.SMTP_USERNAME;
	#SMTP_PASSWORD = process.env.SMTP_PASSWORD;

	constructor() {
		if (process.env.NODE_ENV !== "production") {
			console.log(
				"\n 📧 EmailSender initialized 📧:\
				\nSMTP_HOST: " +
					this.#SMTP_HOST +
					"\nSMTP_PORT: " +
					this.#SMTP_PORT +
					"\nSMTP_USERNAME: " +
					this.#SMTP_USERNAME +
					"\nSMTP_PASSWORD: " +
					this.#SMTP_PASSWORD
			);
		}

		if (!this.#isSMTPConfigured()) {
			throw new InvalidEnvError("SMTP credentials are missing");
		}

		this.transporter = nodemailer.createTransport({
			host: this.#SMTP_HOST,
			port: this.#SMTP_PORT,
			secure: false,
			auth: {
				user: this.#SMTP_USERNAME,
				pass: this.#SMTP_PASSWORD,
			},
		});
	}

	#isSMTPConfigured() {
		return (
			this.#SMTP_HOST &&
			this.#SMTP_PORT &&
			this.#SMTP_USERNAME &&
			this.#SMTP_PASSWORD
		);
	}

	/**
	 *
	 * An Email factory method
	 *
	 * @param {string} to
	 * @param {string} subject
	 * @param {string} text
	 * @param {string} html
	 *
	 * @returns {Email}
	 */
	createNewEmail(to, subject, text, html) {
		return new Email(to, subject, text, html);
	}

	/**
	 *
	 * @param {Email} emailContent
	 * @returns
	 */
	async sendEmail(emailContent) {
		return this.transporter.sendMail(emailContent, (error, info) => {
			if (error) {
				console.error("\n ❌ Email sending failed ❌:\n" + error + "\n");
			} else {
				console.log("\n 📨 Email sent 📨:\n" + info.response + "\n");
			}
		});
	}
}

const emailSenderInstance = new EmailSender();
Object.freeze(emailSenderInstance);

export { emailSenderInstance };
