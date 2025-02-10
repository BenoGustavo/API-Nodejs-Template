import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAccountActivated: { type: Boolean, default: false },
	accountActivationToken: { type: String },
	accountActivationTokenExpires: { type: Date },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Date },
	lists: [{ type: mongoose.Schema.Types.ObjectId, ref: "List" }],
	role: { type: String, default: "user" },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
	if (!this.isModified("password")) return next();
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

export const User = mongoose.model("User", userSchema);
