import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { aiGenerate } from "../controllers/aiController";
import { aiLimiter } from "../middleware/aiLimiter";

const router = Router()

router.use(verifyJWT)
/**
 * @swagger
 * /api/ai/generate:
 *   post:
 *     summary: Generate AI response for notes
 *     description: |
 *       Uses Gemini AI to generate responses such as note summary or priority suggestion.
 *       User can provide either an existing noteId or direct description text.
 *
 *     tags:
 *       - AI
 *
 *     security:
 *       - accessTokenCookie: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AIRequest"
 *
 *     responses:
 *
 *       200:
 *         description: AI response generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/AIResponse"
 *
 *       400:
 *         description: Invalid request data
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
 *                   example: "Zod error, please enter correct field data"
 *                 error:
 *                   type: string
 *                   example: "Invalid enum value for action"
 *
 *       403:
 *         description: Employee does not have permission to access this note
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
 *                   example: "Forbidden"
 *
 *       404:
 *         description: Note not found
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
 *                   example: "Note not found"
 *
 *       503:
 *         description: AI provider temporarily unavailable
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
 *                   example: "AI service is busy. Please try again."
 *
 *       500:
 *         description: Internal server error
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
 *                   example: "AI generation failed"
 */
router.post("/generate", aiLimiter, aiGenerate)


export default router