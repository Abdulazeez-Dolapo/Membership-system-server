const jwt = require("jsonwebtoken")
const config = require("../config/config")

module.exports = function (req, res, next) {
	let token = req.headers["x-access-token"] || req.headers["authorization"]
	const bearer = "Bearer "

	if (token) {
		if (token.startsWith(bearer)) {
			token = token.slice(bearer.length, token.length)
		}

		jwt.verify(token, config.key, (err, decodedToken) => {
			if (err) {
				res.status(401).json({
					success: false,
					message: "Failed to authenticate",
				})
			} else {
				req.decodedToken = decodedToken
				next()
			}
		})
	} else {
		res.json({
			success: false,
			message: "No token provided",
		})
	}
}
