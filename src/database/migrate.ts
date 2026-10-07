import fs from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import type { Pool } from "mysql2/promise";


export async function migrate(pool: Pool): Promise<void> {
    // Crear tabla de migraciones
    await pool.query(`
        CREATE TABLE IF NOT EXISTS schema_migrations (
            id INT AUTO_INCREMENT PRIMARY KEY,
            version VARCHAR(100) NOT NULL UNIQUE,
            fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Obtener migraciones ya ejecutadas
    const [rows] = await pool.query(
        "SELECT version FROM schema_migrations"
    );

    const ejecutadas = new Set(
        (rows as { version: string }[]).map(
            (row) => row.version
        )
    );

    const candidatas = [path.join(__dirname, "migrations"), path.join(process.cwd(), "src", "database", "migrations"),]; 
    const carpeta = candidatas.find((ruta) => existsSync(ruta)); if (!carpeta) { throw new Error(`No se encontró la carpeta de migraciones. Probé: ${candidatas.join(", ")}`); }

    // Leer archivos .sql
    let archivos = await fs.readdir(carpeta);

    archivos = archivos
        .filter((archivo) => archivo.endsWith(".sql"))
        .sort();

    // Ejecutar migraciones pendientes
    for (const archivo of archivos) {
        if (ejecutadas.has(archivo)) {
            continue;
        }

        console.log(`→ Ejecutando migración: ${archivo}`);

        const sql = await fs.readFile(
            path.join(carpeta, archivo),
            "utf8"
        );

        const sentencias = sql
            .split(/;\s*(?:\r?\n|$)/)
            .map((sentencia) => sentencia.trim())
            .filter(Boolean);

        let i = 0;

        for (const sentencia of sentencias) {
            i++;

            try {
                await pool.query(sentencia);
            } catch (error) {
                console.error(
                    `✗ Error en sentencia ${i} de ${archivo}`
                );

                console.error(sentencia);

                throw error;
            }
        }

        await pool.query(
            "INSERT INTO schema_migrations (version) VALUES (?)",
            [archivo]
        );

        console.log(`✓ Migración completada: ${archivo}`);
    }

    console.log("✓ Migraciones listas.");
}