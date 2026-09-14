import {Router} from "express"
import { createNewUser, deleteUser, getAllUsers, getSingleUser, updateUser, getCurrentUser, getUsersIds } from "../controllers/userControllers"
import { verifyJWT } from "../middleware/verifyJWT"
import { verifyRole } from "../middleware/verifyRole"
import { ROLES } from "../lib/constants"
import { apiLimiter } from "../middleware/apiLimiter"

const router = Router()

router.use(verifyJWT)
router.use(apiLimiter)

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: get current user
 *     description: |
 *       return current user that is logged in
 *
 *     tags:
 *       - Users
 *
 *     security:
 *       - accessTokenCookie : []
 *
 *     responses:
 *
 *       200:
 *         description: Current User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: "#/components/schemas/CurrentUser"
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *       400:
 *         description: No Id founded
 *         content:
 *          application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    success: 
 *                        type: boolean
 *                        example: true
 *                    message:
 *                        type: string
 *                        example: "No Id founded"
 *
 */

router.get("/me", verifyRole(ROLES.EMPLOYEE, ROLES.MANAGER, ROLES.ADMIN) , getCurrentUser)
/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: get all users
 *     description: |
 *       Returns users, only admin and manager can access users 
 *
 *     tags:
 *       - Users
 *
 *     security:
 *       - accessTokenCookie : []
 * 
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum:
 *               - Active
 *               - InActive
 *
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *
 *     responses:
 *
 *       200:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/User"
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 *
 */

router.get("/", verifyRole(ROLES.MANAGER, ROLES.ADMIN) , getAllUsers)

/**
 * @swagger
 * /api/users/ids:
 *   get:
 *     summary: get users ids
 *     description: |
 *       return users ids and username without admin
 *
 *     tags:
 *       - Users
 *
 *     security:
 *       - accessTokenCookie : []
 *
 *     responses:
 *
 *       200:
 *         description: UserIds fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 usersId:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/UserIds"
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 *
 */
router.get("/ids", verifyRole(ROLES.MANAGER, ROLES.ADMIN) , getUsersIds)
/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get single user
 *     description: Returns a single user by ID.
 *
 *     tags:
 *       - Users
 *
 *     security:
 *       - accessTokenCookie: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 65f123abc456
 *
 *     responses:
 *
 *       200:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: "#/components/schemas/User"
 *
 *       400:
 *         description: ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "Id is required"
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 *
 *       404:
 *         description: No user found with this id
 */
router.get("/:id", verifyRole(ROLES.MANAGER, ROLES.ADMIN) , getSingleUser)

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     description: Creates a new user.
 *     tags:
 *       - Users
 *     security:
 *       - accessTokenCookie: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Invalid user data
 *
 *       401:
 *         description: Unauthorized
 *
 *       403:
 *         description: Forbidden
 *
 *       409:
 *         description: Username or email already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: Username or email already exists
 */
router.post("/", verifyRole(ROLES.MANAGER, ROLES.ADMIN), createNewUser)
/**
 * @swagger
 * /api/users/{id}:
 *   patch:
 *     summary: update user
 *     description: |
 *       update a  user.
 *       Only Admin and Manager roles can update users.
 * 
 *     tags:
 *       - Users
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 65f123abc456
 * 
 *     security:
 *       - accessTokenCookie: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *
 *     responses:
 *
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *
 *       400:
 *         description: Id is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message: 
 *                  type: string
 *                  example: 'Id is required'
 * 
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *
 *                 message: 
 *                  type: string
 *                  example: 'User not found'
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.patch("/:id", verifyRole(ROLES.MANAGER, ROLES.ADMIN), updateUser)
/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Delete a User
 *     description: |
 *       Deletes a User by its ID.
 *       Only Admin users can delete User.
 *
 *     tags:
 *       - Users
 *
 *     security:
 *       - accessTokenCookie: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *           example: 65f123abc456
 *
 *     responses:
 *
 *       204:
 *         description: User deleted successfully
 *      
 *
 *       400:
 *         description: ID is required
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "ID is required"
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - only Admin can delete Users
 *
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       409:
 *         description: Username or email already exists
 *         content:
 *           application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: false
 *                message:
 *                  type: string
 *                  example: Username or email already exists
 */
router.delete("/:id", verifyRole(ROLES.ADMIN), deleteUser)


export default router