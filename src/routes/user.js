const User = require("../models/user");
const router = require("express").Router();
const mailer = require("../services/mailer");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { ensureAuthenticated } = require("../config/auth");
const crypto = require("crypto");

router.get("/login", async (req, res) => {
	res.render("user/login.ejs");
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
	res.render("user/register.ejs");
});

router.post("/register", async (req, res) => {
	let errors = [];
	const { name, email, mobileNumber, password,password2, collegeName } = req.body;
	if (!name || !email || !mobileNumber || !password || !collegeName) {
		errors.push({ msg: "Fields Cant be empty" });
	}
	if (password.length < 6) {
		errors.push({ msg: "Password should be more than 6 characters" });
	}
	if (password!=password2){
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
	const {
		name,
		email,
		mobileNumber,
		oldPassword,
		newPassword,
		newPassword2,
		collegeName,
	} = req.body;

	if (email != req.user.email) {
		errors.push({ msg: "Email Cannot be Changed" });
		let user = req.user;
		res.render("user/profile.ejs", { user, errors });
		return;
	}

	try {
		const user = await User.findOne({ email: email });
		if (!user) {
			errors.push({ msg: "User not found" });
		} else {
			if (bcrypt.compareSync(oldPassword, user.password)) {
				const saltRounds = 10;
				const newHashedPass = bcrypt.hashSync(newPassword, saltRounds);
				user.password = newHashedPass;
				user.name = name;
				user.collegeName = collegeName;
				const updatedUser = await user.save();
				res.render("user/profile.ejs", {
					confirm: { msg: "Profile Updated Successfully" },
					user: updatedUser,
				});
			} else {
				errors.push({ msg: "Incorrect Password !" });
			}
		}
		if (errors.length > 0) {
			res.render("user/profile.ejs", { errors, user });
		}
	} catch (err) {
		console.log(err);
	}
});

router.get("/forgot", (req, res) => {
	res.render("user/forgot_password.ejs");
});

router.post("/forgot", async (req, res) => {
	try {
		const user = await User.findOne({ email: req.body.email });
		if (user) {
			let randomPassword = crypto.randomBytes(8).toString("hex");
			let email_text = `Your password has been reset to ${randomPassword}, For Security reasons we recommend changing the password as soon as you login `;
			mailer.sendMail(req.body.email, "Password Reset",email_text);
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

router.get("/all", async (req, res) => {
	users = await User.find({});
	res.json(users);
});

module.exports = router;
