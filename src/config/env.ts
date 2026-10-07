import dotenv from "dotenv";

dotenv.config();

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Falta la variable de entorno: ${name}`);
  }

  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3000,

  database: {
    host: getRequiredEnv("DB_HOST"),
    port: Number(process.env.DB_PORT) || 3306,
    user: getRequiredEnv("DB_USER"),
    password: process.env.DB_PASSWORD ?? "",
    ssl: process.env.SSL ?? "",
    name: getRequiredEnv("DB_NAME"),
  },

  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:5173",
  resendApiKey: process.env.RESEND_API_KEY ?? "sin apikey",
};