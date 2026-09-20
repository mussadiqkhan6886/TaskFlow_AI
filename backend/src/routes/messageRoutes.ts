import { Router } from "express";
import { getAllMessages } from "../controllers/messageControllers";
import { verifyJWT } from "../middleware/verifyJWT";

const router = Router()

router.get("/:room", verifyJWT ,getAllMessages)

export default router