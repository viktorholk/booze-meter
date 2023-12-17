CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  gender integer DEFAULT 0,
  weight integer DEFAULT 80
);
CREATE TABLE IF NOT EXISTS drinks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL UNIQUE,
  volume INTEGER NOT NULL,
  alcoholPercentage REAL NOT NULL,
  barcode TEXT UNIQUE
);
CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  drink_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(drink_id) REFERENCES drinks(id)
);
-- encrypted string is 'password'
INSERT
  OR IGNORE INTO users (username, password)
VALUES (
    'sample',
    '$2a$10$.0NA5x8QddbRIbeq.c.Rze.zudtVgASdi.KhKDvvYeTIFKZ0g/gIe'
  );
INSERT
  OR IGNORE INTO drinks (title, volume, alcoholPercentage, barcode)
VALUES (
    'Royal Classic (330mL)',
    330,
    4.6,
    '5741000116487'
  );
INSERT
  OR IGNORE INTO drinks (title, volume, alcoholPercentage)
VALUES ('Vodka Shot (330mL)', 44, 35);