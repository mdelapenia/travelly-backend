import type { Request, Response, NextFunction } from "express";

import {
    createEmail,
    findEmail,
} from "../services/waitlist.service";

import {
    sendWaitlistConfirmation,
} from "../services/email.service";

export async function addToWaitlist(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const { email } = req.body;

        if (!email || typeof email !== "string") {
            return res.status(400).json({
                success: false,
                message: "Ingresá un email válido.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(normalizedEmail)) {
            return res.status(400).json({
                success: false,
                message: "Ingresá un email válido.",
            });
        }

        const alreadyExists = await findEmail(normalizedEmail);

        if (alreadyExists) {
            return res.status(409).json({
                success: false,
                code: "EMAIL_ALREADY_EXISTS",
                message: "Este email ya está registrado.",
            });
        }

        await createEmail(normalizedEmail);

        await sendWaitlistConfirmation(normalizedEmail);

        return res.status(201).json({
            success: true,
            message: "Email registrado correctamente.",
        });
    } catch (error) {
        next(error);
    }
}