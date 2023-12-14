import sqlite3 from "sqlite3";

export default class DatabaseAdapter {
  static db = new sqlite3.Database("db.sqlite");

  static setupSchema() {
    this.db.exec(
      `
        CREATE TABLE IF NOT EXISTS users(
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL,
          password TEXT NOT NULL,
          gender integer DEFAULT 0
        );

        CREATE TABLE IF NOT EXISTS barcodes (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          code TEXT NOT NULL UNIQUE,
          title TEXT NOT NULL,
          description TEXT
        );

        CREATE TABLE IF NOT EXISTS consumptions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          user_id INTEGER NOT NULL,
          amount INTEGER NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(user_id) REFERENCES users(id)
        );

        INSERT OR IGNORE INTO barcodes (code, title, description) VALUES ('5740600371685', 'Carlsberg 33cl', 'A refreshing drink');
        INSERT OR IGNORE INTO barcodes (code, title, description) VALUES ('5712875342110', 'Salling Sour Cream & Onion Chips', 'A refreshing potato');
      `
    );
  }
}
