import { Resend } from "resend";
import { env } from "../config/env";

const resend = new Resend(env.resendApiKey);

// Tokens del :root dark de la landing (--paper, --mist, --ink, --soft, --acc)
// --line es rgba(242,240,235,0.15); en email usamos su equivalente sólido sobre --paper
const C = {
    page: "#141412", // --paper
    card: "#1e1e1b", // --mist
    cardSoft: "#141412", // .alt .box usa --paper dentro de --mist
    border: "#353533", // --line aplanado
    text: "#f2f0eb", // --ink
    muted: "#9a988f", // --soft
    accent: "#7c95ff", // --acc

    
};

const FONT =
    "'Instrument Sans','Helvetica Neue',Helvetica,Arial,sans-serif";

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function buildWaitlistHtml(email: string): string {
    const safeEmail = escapeHtml(email);

    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark" />
    <meta name="supported-color-schemes" content="dark" />
    <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&display=swap"
        rel="stylesheet"
    />
    <title>Ya estás en la lista de Travelly</title>
</head>
<body style="margin: 0; padding: 0; background: ${C.page};" bgcolor="${C.page}">
    <div style="display: none; max-height: 0; overflow: hidden; opacity: 0;">
        Te escribimos a ${safeEmail} cuando sea tu turno.
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"
        bgcolor="${C.page}" style="background: ${C.page};">
        <tr>
            <td align="center" style="padding: 40px 16px;">

                <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0"
                    style="width: 100%; max-width: 560px;">

                    <!-- Marca -->
                    <tr>
                        <td style="padding: 0 4px 24px; font-family: ${FONT}; font-size: 15px; font-weight: 600; color: ${C.text};">
                            Travelly
                        </td>
                    </tr>

                    <!-- Hero -->
                    <tr>
                        <td bgcolor="${C.card}" style="
                            background: ${C.card};
                            border: 1px solid ${C.border};
                            border-radius: 24px;
                            padding: 40px 36px 36px;
                            font-family: ${FONT};
                        ">
                            <img
                                src="https://travelly-murex.vercel.app/travy-email.png""
                                alt="Travy"
                                width="72"
                                height="72"
                                style="display: block; width: 72px; height: 72px; margin: 0 0 28px; border-radius: 50%;"
                            />

                            <h1 style="
                                margin: 0 0 16px;
                                font-family: ${FONT};
                                font-size: 40px;
                                line-height: 1.05;
                                letter-spacing: -0.03em;
                                font-weight: 600;
                                color: ${C.text};
                            ">
                                Ya estás en la lista de espera.
                            </h1>

                            <p style="
                                margin: 0 0 28px;
                                font-size: 16px;
                                line-height: 1.6;
                                color: ${C.muted};
                            ">
                                Te escribiremos a
                                <span style="color: ${C.accent}; font-weight: 600;">${safeEmail}</span>
                                cuando sea tu turno.
                            </p>

                            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                                <tr>
                                    <td bgcolor="${C.cardSoft}" style="
                                        background: ${C.cardSoft};
                                        border: 1px solid ${C.border};
                                        border-radius: 16px;
                                        padding: 16px 18px;
                                        font-family: ${FONT};
                                        font-size: 14px;
                                        line-height: 1.55;
                                        color: ${C.muted};
                                    ">
                                        <span style="color: ${C.text}; font-weight: 600;">No busques. Preguntale a Travy.</span><br />
                                        Travelly reúne todo tu viaje en un solo lugar: equipaje,
                                        clima, requisitos, transporte, actividades e itinerario,
                                        adaptado a tu perfil.
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Pie -->
                    <tr>
                        <td style="padding: 28px 4px 0; font-family: ${FONT}; font-size: 13px; line-height: 1.6; color: ${C.muted};">
                            <span style="color: ${C.text}; font-weight: 600;">Travelly</span><br />
                            Tu viaje. Mucho más fácil.
                            <br /><br />
                            © 2026 Travelly. Recibís este email porque te sumaste a la lista de espera.
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
</body>
</html>`;
}

export async function sendWaitlistConfirmation(email: string): Promise<void> {
    const { error } = await resend.emails.send({
        from: "Travelly <onboarding@resend.dev>",
        to: [email],
        subject: "Ya estás en la lista de Travelly",
        html: buildWaitlistHtml(email),
        text: [
            "Ya estás en la lista de espera.",
            "",
            `Te escribiremos a ${email} cuando sea tu turno.`,
            "",
            "No busques. Preguntale a Travy.",
            "Travelly reúne todo tu viaje en un solo lugar: equipaje, clima, requisitos, transporte, actividades e itinerario, adaptado a tu perfil.",
            "",
            "Tu viaje. Mucho más fácil.",
            "El equipo de Travelly",
        ].join("\n"),
    });

    if (error) {
        console.error("Error enviando email con Resend:", error);
        throw new Error("No se pudo enviar el email de confirmación.");
    }
}