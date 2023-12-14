CREATE TABLE IF NOT EXISTS users(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  gender integer DEFAULT 0,
  weight integer DEFAULT 80
);

CREATE TABLE IF NOT EXISTS items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  size INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  amount INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id),
  FOREIGN KEY(item_id) REFERENCES items(id)
);

-- encrypted string is 'password'
INSERT OR IGNORE INTO users (username, password) VALUES ('sample', '$2a$10$.0NA5x8QddbRIbeq.c.Rze.zudtVgASdi.KhKDvvYeTIFKZ0g/gIe');

INSERT OR IGNORE INTO items (code, title, description, size) VALUES ('5740600371685', 'Carlsberg 33cl', 'A refreshing drink', 12);
INSERT OR IGNORE INTO items (code, title, description, size) VALUES ('5712875342110', 'Salling Sour Cream & Onion Chips', 'A refreshing potato', 5);


