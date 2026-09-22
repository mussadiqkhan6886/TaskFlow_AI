import { Router } from "express";
import { getAllMessages } from "../controllers/messageControllers";
import { verifyJWT } from "../middleware/verifyJWT";

const router = Router()
/**
 * @swagger
 * /api/messages/{room}:
 *  get:
 *      summary: get all messages
 *      description: |
 *          Returns all messages according to room
 * 
 *      tags:
 *        - Messages
 * 
 *      security:
 *        - accessTokenCookie: []
 * 
 *      parameters:
 *        - in: path
 *          name: room
 *          required: true
 *          description: Room name
 *          schema: 
 *              type: string
 *              example: "user-room"
 * 
 *      responses:
 * 
 *        200:
 *          description: All Messages fetched
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: true
 *                  msgs:
 *                    $ref: "#/components/schemas/Message"
 *        400:
 *          description: Room is required
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Room is required
 *        403:
 *          description: Forbidden
 *          content:
 *            application/json:
 *              schema:
 *                type: Object
 *                properties:
 *                  success:
 *                    type: boolean
 *                    example: false
 *                  message:
 *                    type: string
 *                    example: Forbidden
 */
router.get("/:room", verifyJWT ,getAllMessages)

export default router