import { Router } from "express";

import { addToWaitlist } from "../controllers/waitlist.controller";

const router = Router();

router.post("/", addToWaitlist);

export default router;