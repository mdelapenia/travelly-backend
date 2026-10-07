import express from "express";
import cors from "cors";

import { env } from "./config/env";
import waitlistRoutes from "./routes/waitlist.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

const app = express();

app.use(
    cors({
        origin: env.frontendUrl,
    })
);

app.use(express.json());

app.get("/api/health", (_req, res) => {
    return res.json({
        success: true,
        message: "Travelly API funcionando.",
    });
});

app.use("/api/waitlist", waitlistRoutes);

app.use(errorMiddleware);

export default app;