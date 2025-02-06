class EmailSender {
	constructor() {
		// Mock constructor
	}

	async sendEmail(emailContent) {
		// Mock sendEmail method
		return Promise.resolve();
	}
}

export default new EmailSender();
export class Email {
	constructor(to, subject, text, html) {
		this.to = to;
		this.subject = subject;
		this.text = text;
		this.html = html;
	}
}
