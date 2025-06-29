-- Schema SQLite3 untuk Google Play Games Scraper
-- Desain untuk efisiensi ruang dan deteksi perubahan

-- Tabel developer untuk normalisasi
CREATE TABLE IF NOT EXISTS developers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    developer_id TEXT UNIQUE,
    email TEXT,
    website TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel kategori games
CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category_id TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabel utama games
CREATE TABLE IF NOT EXISTS games (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    app_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    developer_id INTEGER,
    category_id INTEGER,
    genre TEXT,
    summary TEXT,
    description_hash TEXT, -- Hash untuk deteksi perubahan deskripsi
    icon_url TEXT,
    header_image_url TEXT,
    video_url TEXT,
    content_rating TEXT,
    free BOOLEAN NOT NULL DEFAULT 1,
    price REAL DEFAULT 0,
    currency TEXT DEFAULT 'USD',
    price_text TEXT,
    score REAL,
    score_text TEXT,
    ratings INTEGER,
    reviews INTEGER,
    installs_text TEXT,
    min_installs INTEGER,
    max_installs INTEGER,
    android_version TEXT,
    version TEXT,
    size_bytes INTEGER,
    released_date TEXT,
    updated_timestamp INTEGER,
    offers_iap BOOLEAN DEFAULT 0,
    iap_range TEXT,
    ad_supported BOOLEAN DEFAULT 0,
    available BOOLEAN DEFAULT 1,
    preregister BOOLEAN DEFAULT 0,
    early_access BOOLEAN DEFAULT 0,
    play_pass BOOLEAN DEFAULT 0,
    first_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    data_hash TEXT NOT NULL, -- Hash keseluruhan data untuk deteksi perubahan
    FOREIGN KEY (developer_id) REFERENCES developers(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Tabel untuk tracking perubahan data
CREATE TABLE IF NOT EXISTS game_changes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    field_name TEXT NOT NULL,
    old_value TEXT,
    new_value TEXT,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Tabel untuk data historis harga
CREATE TABLE IF NOT EXISTS price_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    price REAL NOT NULL,
    currency TEXT NOT NULL,
    price_text TEXT,
    original_price REAL,
    discount_end_date TEXT,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Tabel untuk data historis rating
CREATE TABLE IF NOT EXISTS rating_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    score REAL,
    score_text TEXT,
    ratings INTEGER,
    reviews INTEGER,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Tabel untuk tracking installs
CREATE TABLE IF NOT EXISTS install_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    min_installs INTEGER,
    max_installs INTEGER,
    installs_text TEXT,
    recorded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Tabel untuk screenshots (opsional, untuk analisis)
CREATE TABLE IF NOT EXISTS screenshots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    game_id INTEGER NOT NULL,
    url TEXT NOT NULL,
    position INTEGER DEFAULT 0,
    added_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id)
);

-- Index untuk performa
CREATE INDEX IF NOT EXISTS idx_games_app_id ON games(app_id);
CREATE INDEX IF NOT EXISTS idx_games_developer ON games(developer_id);
CREATE INDEX IF NOT EXISTS idx_games_category ON games(category_id);
CREATE INDEX IF NOT EXISTS idx_games_free ON games(free);
CREATE INDEX IF NOT EXISTS idx_games_score ON games(score);
CREATE INDEX IF NOT EXISTS idx_games_updated ON games(last_updated_at);
CREATE INDEX IF NOT EXISTS idx_games_data_hash ON games(data_hash);

CREATE INDEX IF NOT EXISTS idx_changes_game_id ON game_changes(game_id);
CREATE INDEX IF NOT EXISTS idx_changes_date ON game_changes(changed_at);

CREATE INDEX IF NOT EXISTS idx_price_history_game ON price_history(game_id);
CREATE INDEX IF NOT EXISTS idx_price_history_date ON price_history(recorded_at);

CREATE INDEX IF NOT EXISTS idx_rating_history_game ON rating_history(game_id);
CREATE INDEX IF NOT EXISTS idx_rating_history_date ON rating_history(recorded_at);

CREATE INDEX IF NOT EXISTS idx_install_history_game ON install_history(game_id);
CREATE INDEX IF NOT EXISTS idx_install_history_date ON install_history(recorded_at);

-- Insert kategori game default
INSERT OR IGNORE INTO categories (category_id, name) VALUES 
('GAME', 'Games'),
('GAME_ACTION', 'Action Games'),
('GAME_ADVENTURE', 'Adventure Games'),
('GAME_ARCADE', 'Arcade Games'),
('GAME_BOARD', 'Board Games'),
('GAME_CARD', 'Card Games'),
('GAME_CASINO', 'Casino Games'),
('GAME_CASUAL', 'Casual Games'),
('GAME_EDUCATIONAL', 'Educational Games'),
('GAME_MUSIC', 'Music Games'),
('GAME_PUZZLE', 'Puzzle Games'),
('GAME_RACING', 'Racing Games'),
('GAME_ROLE_PLAYING', 'Role Playing Games'),
('GAME_SIMULATION', 'Simulation Games'),
('GAME_SPORTS', 'Sports Games'),
('GAME_STRATEGY', 'Strategy Games'),
('GAME_TRIVIA', 'Trivia Games'),
('GAME_WORD', 'Word Games');