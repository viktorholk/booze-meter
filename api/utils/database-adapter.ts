import sqlite3 from "sqlite3";

export default class DatabaseAdapter {
  static db = new sqlite3.Database("db.sqlite");

  static setupSchema(seed: false) {
    this.db.exec(
      `
        CREATE TABLE IF NOT EXISTS profiles (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          gender integer NOT NULL,
        );

        CREATE TABLE IF NOT EXISTS barcodes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          description TEXT,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );

        CREATE TABLE IF NOT EXISTS consumptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          profile_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(profile_id) REFERENCES profile(id)
        );

      `
    );

    if (seed) {
      this.db.exec(
        `
          INSERT OR IGNORE INTO barcodes (code, title, description) VALUES ('5740600371685', 'Carlsberg 33cl', 'A refreshing drink');

        `
      );
    }
  }
}
