const router = require("express").Router()
const AuthController = require("../controllers/auth")
const verifyToken = require("../middlewares/verify-token")

// Register a new member
router.post("/auth/register", AuthController.register)

// Login
router.post("/auth/login", AuthController.login)

// Member profile route
router.get("/auth/member", verifyToken, AuthController.memberDetails)

module.exports = router
