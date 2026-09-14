import {Router} from "express"
import { login, logout, refresh } from "../controllers/authControllers"
import { loginLimiter } from "../middleware/loginLimiter"

const router = Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: |
 *       Authenticates user credentials.
 *       On success, server sets:
 *       - accessToken cookie (15 minutes)
 *       - refreshToken cookie (7 days)
 *
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Login successful
 *
 *       400:
 *         description: Missing username or password
 *
 *       401:
 *         description: Incorrect password
 *
 *       404:
 *         description: User not found or inactive
 */
router.post("/login", loginLimiter, login)
/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: |
 *       Generates a new access token using the refreshToken cookie.
 *       On success, server sets a new accessToken cookie.
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - refreshTokenCookie: []
 *
 *     responses:
 *
 *       200:
 *         description: Token refreshed successfully
 *
 *       401:
 *         description: No refresh token provided
 *
 *       403:
 *         description: Invalid refresh token
 */
router.post("/refresh", refresh);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: logout user
 *     description: |
 *       logout user and clear access and refresh token.
 *       On success, server remove:
 *       - accessToken cookie 
 *       - refreshToken cookie
 *
 *     tags:
 *       - Authentication
 *
 *     security:
 *       - accessTokenCookie: []
 *       - refreshTokenCookie: []
 *
 *     responses:
 *
 *       204:
 *         description: No Content 
 *
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", logout)

export default router