import { Router } from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { aiGenerate } from "../controllers/aiController";
import { aiLimiter } from "../middleware/aiLimiter";

const router = Router()

router.use(verifyJWT)
router.get("/generate" , aiLimiter ,aiGenerate)


export default router