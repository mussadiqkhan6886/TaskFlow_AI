import {Router} from "express"
import { verifyJWT } from "../middleware/verifyJWT"
import { apiLimiter } from "../middleware/apiLimiter"
import { verifyRole } from "../middleware/verifyRole"
import { ROLES } from "../lib/constants"
import { createNewNote, deleteNote, getAllNotes, getSingleNote, updateNote } from "../controllers/noteControllers"

const router = Router()

router.use(verifyJWT)
router.use(apiLimiter)

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: get all notes
 *     description: |
 *       Returns notes based on the authenticated user's role:
 *       - Admin: Can view all notes
 *       - Manager: Can view all notes
 *       - Employee: Can view only assigned notes
 *
 *     tags:
 *       - Notes
 *
 *     security:
 *       - accessTokenCookie : []
 *
 *     responses:
 *
 *       200:
 *         description: Notes fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/Note"
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 *
 */
router.get("/", verifyRole(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER), getAllNotes)

/**
 * @swagger
 * /api/notes/{id}:
 *   get:
 *     summary: Get single note
 *     description: Returns a single note by ID.
 *
 *     tags:
 *       - Notes
 *
 *     security:
 *       - accessTokenCookie: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *           example: 65f123abc456
 *
 *     responses:
 *
 *       200:
 *         description: Note fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 note:
 *                   $ref: "#/components/schemas/Note"
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
 *                   example: "id is required"
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 *
 *       404:
 *         description: No note found
 */
router.get("/:id", verifyRole(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER), getSingleNote)
/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Create a new note
 *     description: |
 *       Creates a new note.
 *       Only Admin and Manager roles can create notes.
 *
 *     tags:
 *       - Notes
 *
 *     security:
 *       - accessTokenCookie: []
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNoteRequest'
 *
 *     responses:
 *
 *       201:
 *         description: Note created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *
 *                 newNote:
 *                   $ref: '#/components/schemas/Note'
 *
 *       400:
 *         description: Invalid note data
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.post("/", verifyRole(ROLES.ADMIN, ROLES.MANAGER), createNewNote)
/**
 * @swagger
 * /api/notes/{id}:
 *   patch:
 *     summary: update note
 *     description: |
 *       update a  note.
 *       Only Admin and Manager roles can update all properties of notes.
 *       Employee can not update noteFor
 * 
 *     tags:
 *       - Notes
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
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
 *             $ref: '#/components/schemas/UpdateNoteRequest'
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
 *                 note:
 *                   $ref: '#/components/schemas/Note'
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
 *         description: NOte not found
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
 *                  example: 'Note not found'
 *
 *       401:
 *         description: Unauthorized - missing or invalid access token
 *
 *       403:
 *         description: Forbidden - insufficient permissions
 */
router.patch("/:id", verifyRole(ROLES.EMPLOYEE, ROLES.ADMIN, ROLES.MANAGER), updateNote)
/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Delete a note
 *     description: |
 *       Deletes a note by its ID.
 *       Only Admin users can delete notes.
 *
 *     tags:
 *       - Notes
 *
 *     security:
 *       - accessTokenCookie: []
 *
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Note ID
 *         schema:
 *           type: string
 *           example: 65f123abc456
 *
 *     responses:
 *
 *       204:
 *         description: Note deleted successfully
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
 *         description: Forbidden - only Admin can delete notes
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
 */
router.delete("/:id", verifyRole(ROLES.ADMIN), deleteNote)

export default router