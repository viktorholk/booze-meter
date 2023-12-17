import sqlite3 from 'sqlite3';
import { readFileSync } from 'fs';
import path from 'path';

export default class DatabaseAdapter {
  static db = new sqlite3.Database('db.sqlite');

  static setupSchema() {
    this.db.exec(readFileSync(path.join(__dirname, '../schema.sql')).toString());
  }
}
