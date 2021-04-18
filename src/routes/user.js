const User = require("../models/user");
const router = require("express").Router();
const mailer = require("../services/mailer");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const crypto = require("crypto");

router.get("/login", async (req, res) => {
	if (req.isAuthenticated()) res.redirect("/");
	else res.render("user/login.ejs");
});

router.post("/login", async (req, res, next) => {
	passport.authenticate("local", {
		successRedirect: "/",
		failureRedirect: "/user/login",
		failureFlash: true,
	})(req, res, next);
});

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success_msg", "Logged Out succesfully");
	res.redirect("/user/login");
});

router.get("/register", async (req, res) => {
	if (req.isAuthenticated()) res.redirect("/");
	else res.render("user/register.ejs");
});

router.post("/register", async (req, res) => {
	let errors = [];
	const {
		name,
		email,
		mobileNumber,
		password,
		password2,
		collegeName,
	} = req.body;
	if (!name || !email || !mobileNumber || !password || !collegeName) {
		errors.push({ msg: "Fields Cant be empty" });
	}
	if (password.length < 6 && password.length > 20) {
		errors.push({ msg: "Password should be more between 6 and 20 characters" });
	}
	if (name.length > 30 || email.length > 50 || collegeName.length > 200) {
		errors.push({ msg:"APNI KABILIYAT KAHI AUR" });
	}
	if (password != password2) {
		errors.push({ msg: "Passwords does not match" });
	}

	try {
		let user = await User.findOne({ email: email });
		if (user) {
			errors.push({ msg: "Email already in use" });
		}
		if (errors.length > 0) {
			res.render("user/register", {
				errors,
				name,
				email,
				mobileNumber,
				collegeName,
			});
		} else {
			const saltRounds = 10;
			const hashPass = await bcrypt.hash(password, saltRounds);
			let newUser = User({
				name: name,
				email: email,
				mobileNumber: mobileNumber,
				password: hashPass,
				collegeName: collegeName,
			});
			newUser
				.save()
				.then(() => {
					req.flash("success_msg", "Registered Successfully");
					mailer.sendMail(email, "Welcome to Konst", "Good luck!");
					res.redirect("/user/login");
				})
				.catch((err) => {
					console.log(err);
					res.sendStatus(500);
				});
		}
	} catch (e) {
		console.log(e);
	}
});

router.get("/profile", ensureAuthenticated, async (req, res) => {
	res.render("user/profile", { user: req.user });
});

router.post("/profile", ensureAuthenticated, async (req, res) => {
	let errors = [];
	let user=req.user;
	const { name, email, mobileNumber, collegeName } = req.body;

	if (email != req.user.email) {
		errors.push({ msg: "Email Cannot be Changed" });
		let user = req.user;
		res.render("user/profile.ejs", { user, errors });
		return;
	}

	if (name.length > 30 || email.length > 50 || collegeName.length > 200) {
		errors.push({ msg: "APNI KABILIYAT KAHI AUR" });
	}
	if (errors.length > 0) {
		res.render("user/profile.ejs", { errors, user });
	} else {
		try {
			const user = await User.findOne({ email: email });
			if (!user) {
				errors.push({ msg: "User not found" });
			} else {
				user.name = name;
				user.collegeName = collegeName;
				user.mobileNumber = mobileNumber;
				const updatedUser = await user.save();
				res.render("user/profile.ejs", {
					confirm: { msg: "Profile Updated Successfully" },
					user: updatedUser,
				});
			}
			if (errors.length > 0) {
				res.render("user/profile.ejs", { errors, user });
			}
		} catch (err) {
			console.log(err);
		}
	}
});

router.get("/profile/updatePassword", ensureAuthenticated, async (req, res) => {
	res.render("user/update_password.ejs");
});

router.post(
	"/profile/updatePassword",
	ensureAuthenticated,
	async (req, res) => {
		const { oldPassword, newPassword, newPassword2 } = req.body;
		let errors = [];
		if (newPassword.length < 6 && newPassword.length > 20) {
			errors.push({
				msg: "Password should be more between 6 and 20 characters",
			});
		}

		if (newPassword != newPassword2) {
			errors.push({ msg: "Passwords does not match" });
		}

		if (errors.length > 0) {
			res.render("user/update_password.ejs", { errors });
		} else {
			try {
				bcrypt.compare(oldPassword, req.user.password, async (err, isMatch) => {
					if (err) throw err;
					if (isMatch) {
						const saltRounds = 10;
						const hashPass = await bcrypt.hash(newPassword, saltRounds);
						let user = await User.findOne({ email: req.user.email });
						user.password = hashPass;
						const updatedUser = await user.save();
						res.render("user/update_password.ejs", {
							confirm: { msg: "Password Updated Successfully" },
							user: updatedUser,
						});
					} else {
						errors.push({ msg: "Incorrect Password" });
						res.render("user/update_password.ejs", { errors });
					}
				});
			} catch (err) {
				console.log(err);
			}
		}
	}
);

router.get("/forgot", (req, res) => {
	res.render("user/forgot_password.ejs");
});

router.post("/forgot", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			let randomPassword = crypto.randomBytes(8).toString("hex");
			let email_text = `Your password has been reset to ${randomPassword}, For Security reasons we recommend changing the password as soon as you login `;
			mailer.sendMail(req.body.email, "Password Reset", email_text);
			const saltRounds = 10;
			const newHashedPass = bcrypt.hashSync(randomPassword, saltRounds);
			user.password = newHashedPass;
			await user.save();
		}
		res.render("user/forgot_password.ejs", {
			confirm: { msg: "Check Your Mail For New Password" },
		});
	} catch (err) {
		console.log(err);
	}
});

module.exports = router;
