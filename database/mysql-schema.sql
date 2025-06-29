-- MySQL Schema untuk Google Play Games Scraper

-- Table untuk menyimpan kategori
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert kategori default
INSERT IGNORE INTO categories (category_id, name) VALUES
('GAME', 'Games'),
('GAME_ACTION', 'Action'),
('GAME_ADVENTURE', 'Adventure'),
('GAME_ARCADE', 'Arcade'),
('GAME_BOARD', 'Board'),
('GAME_CARD', 'Card'),
('GAME_CASINO', 'Casino'),
('GAME_CASUAL', 'Casual'),
('GAME_EDUCATIONAL', 'Educational'),
('GAME_MUSIC', 'Music'),
('GAME_PUZZLE', 'Puzzle'),
('GAME_RACING', 'Racing'),
('GAME_ROLE_PLAYING', 'Role Playing'),
('GAME_SIMULATION', 'Simulation'),
('GAME_SPORTS', 'Sports'),
('GAME_STRATEGY', 'Strategy'),
('GAME_TRIVIA', 'Trivia'),
('GAME_WORD', 'Word');

-- Table untuk developer
CREATE TABLE IF NOT EXISTS developers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    developer_id VARCHAR(255),
    email VARCHAR(255),
    website VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY idx_developer_name (name)
);

-- Table utama untuk games
CREATE TABLE IF NOT EXISTS games (
    id INT AUTO_INCREMENT PRIMARY KEY,
    app_id VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    developer_id INT,
    category_id INT,
    genre VARCHAR(100),
    summary TEXT,
    description_hash VARCHAR(32),
    icon_url VARCHAR(500),
    header_image_url VARCHAR(500),
    video_url VARCHAR(500),
    content_rating VARCHAR(50),
    free BOOLEAN DEFAULT true,
    price DECIMAL(10, 2) DEFAULT 0,
    currency VARCHAR(10),
    price_text VARCHAR(50),
    score DECIMAL(3, 2),
    score_text VARCHAR(50),
    ratings INT DEFAULT 0,
    reviews INT DEFAULT 0,
    installs_text VARCHAR(100),
    min_installs BIGINT DEFAULT 0,
    max_installs BIGINT DEFAULT 0,
    android_version VARCHAR(50),
    version VARCHAR(50),
    released_date DATE,
    updated_timestamp BIGINT,
    offers_iap BOOLEAN DEFAULT false,
    iap_range VARCHAR(100),
    ad_supported BOOLEAN DEFAULT false,
    available BOOLEAN DEFAULT true,
    preregister BOOLEAN DEFAULT false,
    early_access BOOLEAN DEFAULT false,
    play_pass BOOLEAN DEFAULT false,
    data_hash VARCHAR(32),
    last_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_app_id (app_id),
    INDEX idx_category (category_id),
    INDEX idx_developer (developer_id),
    INDEX idx_score (score),
    INDEX idx_ratings (ratings),
    INDEX idx_last_updated (last_updated_at),
    FOREIGN KEY (developer_id) REFERENCES developers(id) ON DELETE SET NULL,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Table untuk menyimpan deskripsi game (karena bisa panjang)
CREATE TABLE IF NOT EXISTS game_descriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    description TEXT,
    recent_changes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE
);

-- Table untuk screenshots
CREATE TABLE IF NOT EXISTS game_screenshots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    screenshot_url VARCHAR(500),
    thumbnail_url VARCHAR(500),
    position INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_game_screenshots (game_id)
);

-- Table untuk track perubahan
CREATE TABLE IF NOT EXISTS game_changes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    field_name VARCHAR(50),
    old_value TEXT,
    new_value TEXT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_game_changes (game_id, change_date)
);

-- Table untuk history harga
CREATE TABLE IF NOT EXISTS price_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    price DECIMAL(10, 2),
    currency VARCHAR(10),
    price_text VARCHAR(50),
    original_price DECIMAL(10, 2),
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_price_history (game_id, record_date)
);

-- Table untuk history rating
CREATE TABLE IF NOT EXISTS rating_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    score DECIMAL(3, 2),
    score_text VARCHAR(50),
    ratings INT,
    reviews INT,
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_rating_history (game_id, record_date)
);

-- Table untuk history install
CREATE TABLE IF NOT EXISTS install_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    game_id INT NOT NULL,
    min_installs BIGINT,
    max_installs BIGINT,
    installs_text VARCHAR(100),
    record_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (game_id) REFERENCES games(id) ON DELETE CASCADE,
    INDEX idx_install_history (game_id, record_date)
);

-- Table untuk scraping logs
CREATE TABLE IF NOT EXISTS scraping_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    scrape_type VARCHAR(50),
    category VARCHAR(50),
    collection VARCHAR(50),
    games_scraped INT DEFAULT 0,
    games_updated INT DEFAULT 0,
    games_new INT DEFAULT 0,
    errors INT DEFAULT 0,
    duration_seconds INT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP NULL,
    status VARCHAR(20) DEFAULT 'running',
    error_message TEXT
);