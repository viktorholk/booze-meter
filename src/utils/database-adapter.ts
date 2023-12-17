import sqlite3 from "sqlite3";
import { readFileSync } from 'fs';
import path from 'path';

export default class DatabaseAdapter {
  static db = new sqlite3.Database("db.sqlite");

  static setupSchema(seed = false) {
    this.db.exec(readFileSync(path.join(__dirname, '../schema.sql')).toString());


    if (seed)
      this.db.exec(`
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 1, 3, DATETIME('now', '-7 hour', 'localtime'));
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 1, 2, DATETIME('now', '-5 hour', 'localtime'));
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 1, 1, DATETIME('now', '-3 hour', 'localtime'));
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 1, 4, DATETIME('now', '-2 hour', 'localtime'));
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 1, 1, DATETIME('now', '-1 hour', 'localtime'));
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 2, 1, DATETIME('now', 'localtime'));
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 1, 1, DATETIME('now', 'localtime'));
      INSERT INTO entries (user_id, drink_id, amount, created_at) VALUES (1, 1, 1, DATETIME('now', 'localtime'));
    `);
  }
}
