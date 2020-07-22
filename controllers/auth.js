const Member = require("../models/members")
const jwt = require("jsonwebtoken")
const config = require("../config/config")
const ONE_DAY = 60 * 60 * 24

const isEmpty = string => {
	if (string.trim().length < 1) return true
	else return false
}

class AuthController {
	// Register member
	static async register(req, res) {
		// Validate member's input
		const { username, password } = req.body
		if (isEmpty(username)) {
			return res.status(400).json({
				success: false,
				message: "Please enter a valid username",
			})
		}

		if (isEmpty(password)) {
			return res.status(400).json({
				success: false,
				message: "Please enter a valid password",
			})
		}
		try {
			// Check if username already exists
			let foundUser = await Member.findOne({
				username: req.body.username,
			})
			if (foundUser) {
				return res.status(400).json({
					success: false,
					message: "Member with the username already exists",
				})
			} else {
				let member = new Member()
				member.username = req.body.username
				member.password = req.body.password

				await member.save()

				let token = jwt.sign(member.toJSON(), config.key, {
					expiresIn: ONE_DAY,
				})

				res.json({
					success: true,
					token,
					message: "Member registered",
				})
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			})
		}
	}

	// Login member
	static async login(req, res) {
		// Validate member's input
		const { username, password } = req.body
		if (isEmpty(username)) {
			return res.status(400).json({
				success: false,
				message: "Please enter a valid username",
			})
		}

		if (isEmpty(password)) {
			return res.status(400).json({
				success: false,
				message: "Please enter a valid password",
			})
		}
		try {
			const foundUser = await Member.findOne({ username }).select(
				"+password"
			)
			if (!foundUser) {
				res.status(403).json({
					success: false,
					message: "Username or password incorrect",
				})
			} else {
				if (foundUser.comparePassword(password)) {
					// Remove password from foundUser object
					const member = {
						username: foundUser.username,
						_id: foundUser._id,
					}
					const token = jwt.sign(member, config.key, {
						expiresIn: ONE_DAY,
					})
					res.json({
						success: true,
						token,
					})
				} else {
					res.status(403).json({
						success: false,
						message: "Username or password incorrect",
					})
				}
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			})
		}
	}

	// Get member details
	static async memberDetails(req, res) {
		try {
			let member = await Member.findOne({ _id: req.decodedToken._id })
			if (member) {
				res.json({
					success: true,
					member,
					message: "Member found",
				})
			}
		} catch (error) {
			res.status(500).json({
				success: false,
				message: error.message,
			})
		}
	}
}

module.exports = AuthController
