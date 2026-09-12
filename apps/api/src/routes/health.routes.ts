import { Router } from "express";
import { prisma } from "@wholesale/db";

const router = Router();

router.get("/", async (_, res) => {
    await prisma.$queryRaw`SEECT 1`;
    res.json({status: "ok", database: "connected"});
});

export default router;