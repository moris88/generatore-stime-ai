import * as fs from 'node:fs';
import path from 'node:path';
import Database from 'better-sqlite3';
import type { EstimateHistory } from './utils';

const DB_PATH = path.join(process.cwd(), 'stima_history.db');
const JSON_HISTORY_FILE = path.join(process.cwd(), 'stima_history.json');

const db = new Database(DB_PATH);

// Inizializzazione del database
db.exec(`
  CREATE TABLE IF NOT EXISTS estimates (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    clientName TEXT NOT NULL,
    date TEXT NOT NULL,
    stack TEXT NOT NULL,
    scope TEXT NOT NULL,
    hours TEXT NOT NULL,
    days TEXT NOT NULL,
    objective TEXT NOT NULL,
    fullSummary TEXT NOT NULL
  )
`);

export async function migrateFromJson() {
	if (fs.existsSync(JSON_HISTORY_FILE)) {
		try {
			const data = fs.readFileSync(JSON_HISTORY_FILE, 'utf8');
			const history: EstimateHistory[] = JSON.parse(data);

			const insert = db.prepare(`
                INSERT INTO estimates (clientName, date, stack, scope, hours, days, objective, fullSummary)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

			const insertMany = db.transaction((entries: EstimateHistory[]) => {
				for (const entry of entries) {
					insert.run(
						entry.clientName,
						entry.date,
						entry.stack,
						entry.scope,
						entry.hours,
						entry.days,
						entry.objective,
						entry.fullSummary,
					);
				}
			});

			insertMany(history);
			console.log(
				`Migrate ${history.length} stime dal file JSON al database SQLite.`,
			);

			// Rinomina il file JSON per evitare migrazioni doppie (opzionale, ma sicuro)
			fs.renameSync(JSON_HISTORY_FILE, `${JSON_HISTORY_FILE}.bak`);
			console.log(`File JSON rinominato in ${JSON_HISTORY_FILE}.bak`);
		} catch (error) {
			console.error('Errore durante la migrazione dal file JSON:', error);
		}
	}
}

export function saveEstimate(entry: EstimateHistory) {
	const insert = db.prepare(`
        INSERT INTO estimates (clientName, date, stack, scope, hours, days, objective, fullSummary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
	insert.run(
		entry.clientName,
		entry.date,
		entry.stack,
		entry.scope,
		entry.hours,
		entry.days,
		entry.objective,
		entry.fullSummary,
	);
}

export function getHistoricalEstimates(scope?: string): EstimateHistory[] {
	if (scope) {
		return db
			.prepare('SELECT * FROM estimates WHERE scope = ? ORDER BY date DESC')
			.all(scope) as EstimateHistory[];
	}
	return db
		.prepare('SELECT * FROM estimates ORDER BY date DESC')
		.all() as EstimateHistory[];
}

export function getAllEstimates(): (EstimateHistory & { id: number })[] {
	return db
		.prepare('SELECT * FROM estimates ORDER BY date DESC')
		.all() as (EstimateHistory & { id: number })[];
}
