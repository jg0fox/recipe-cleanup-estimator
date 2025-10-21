import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize database
const db = new Database(join(__dirname, '../recipe_cleanup.db'));

// Enable foreign keys
db.pragma('foreign_keys = ON');

/**
 * Initialize database schema
 */
export function initializeDatabase() {
  // Equipment types table
  db.exec(`
    CREATE TABLE IF NOT EXISTS equipment_types (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT UNIQUE NOT NULL,
      base_time_seconds INTEGER NOT NULL,
      dishwasher_safe TEXT NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // User feedback table
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_url TEXT NOT NULL,
      estimated_total_time INTEGER NOT NULL,
      actual_total_time INTEGER,
      equipment_feedback TEXT,
      feedback_text TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Recipe analysis cache table
  db.exec(`
    CREATE TABLE IF NOT EXISTS recipe_analysis_cache (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      recipe_url TEXT UNIQUE NOT NULL,
      scraped_data TEXT NOT NULL,
      equipment_instances TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      expires_at DATETIME NOT NULL
    )
  `);

  console.log('Database initialized successfully');
}

/**
 * Seed equipment types from constants
 */
export function seedEquipmentTypes(equipmentTypes) {
  const insert = db.prepare(`
    INSERT OR IGNORE INTO equipment_types (name, base_time_seconds, dishwasher_safe, category)
    VALUES (?, ?, ?, ?)
  `);

  const insertMany = db.transaction((equipment) => {
    for (const [name, config] of Object.entries(equipment)) {
      insert.run(
        name,
        config.baseTime,
        typeof config.dishwasherSafe === 'boolean'
          ? config.dishwasherSafe.toString()
          : config.dishwasherSafe,
        config.category
      );
    }
  });

  insertMany(equipmentTypes);
  console.log('Equipment types seeded successfully');
}

/**
 * Cache recipe analysis
 */
export function cacheRecipeAnalysis(url, scrapedData, equipmentInstances) {
  const stmt = db.prepare(`
    INSERT OR REPLACE INTO recipe_analysis_cache (recipe_url, scraped_data, equipment_instances, expires_at)
    VALUES (?, ?, ?, datetime('now', '+7 days'))
  `);

  stmt.run(url, JSON.stringify(scrapedData), JSON.stringify(equipmentInstances));
}

/**
 * Get cached recipe analysis
 */
export function getCachedRecipeAnalysis(url) {
  const stmt = db.prepare(`
    SELECT scraped_data, equipment_instances
    FROM recipe_analysis_cache
    WHERE recipe_url = ? AND expires_at > datetime('now')
  `);

  const result = stmt.get(url);

  if (result) {
    return {
      scrapedData: JSON.parse(result.scraped_data),
      equipmentInstances: JSON.parse(result.equipment_instances)
    };
  }

  return null;
}

/**
 * Save user feedback
 */
export function saveFeedback(feedbackData) {
  const stmt = db.prepare(`
    INSERT INTO user_feedback (recipe_url, estimated_total_time, actual_total_time, equipment_feedback, feedback_text)
    VALUES (?, ?, ?, ?, ?)
  `);

  stmt.run(
    feedbackData.recipeUrl,
    feedbackData.estimatedTime,
    feedbackData.actualTime || null,
    feedbackData.equipmentFeedback ? JSON.stringify(feedbackData.equipmentFeedback) : null,
    feedbackData.comments || null
  );
}

/**
 * Clean up expired cache entries
 */
export function cleanupExpiredCache() {
  const stmt = db.prepare(`
    DELETE FROM recipe_analysis_cache
    WHERE expires_at < datetime('now')
  `);

  const result = stmt.run();
  console.log(`Cleaned up ${result.changes} expired cache entries`);
}

/**
 * Get all feedback for analytics
 */
export function getAllFeedback() {
  const stmt = db.prepare(`
    SELECT * FROM user_feedback
    ORDER BY created_at DESC
  `);

  return stmt.all();
}

export default db;
