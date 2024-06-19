-- Создание базы данных
CREATE DATABASE lr_1;
USE lr_1;

-- Создание таблицы физические лица
CREATE TABLE individuals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    sur_name VARCHAR(50),
    passport VARCHAR(10),
    inn VARCHAR(12),
    snils VARCHAR(11),
    driver_license VARCHAR(20),
    additional_docs TEXT,
    notes TEXT
);

-- Создание таблицы заёмные средства
CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    individual_id INT,
    amount DECIMAL(10, 2),
    percent DECIMAL(5, 2),
    rate DECIMAL(5, 2),
    term INT,
    conditions TEXT,
    notes TEXT,
    FOREIGN KEY (individual_id) REFERENCES individuals(id)
);

-- Создание таблицы кредиты для организаций
CREATE TABLE orgloans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    organization_id INT,
    individual_id INT,
    amount DECIMAL(10, 2),
    term INT,
    percent DECIMAL(5, 2),
    conditions TEXT,
    notes TEXT,
    FOREIGN KEY (individual_id) REFERENCES individuals(id)
);

-- Создание таблицы заёмщики
CREATE TABLE borrowers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inn VARCHAR(12),
    entity_type ENUM('individual', 'organization'),
    address TEXT,
    amount DECIMAL(10, 2),
    conditions TEXT,
    notes TEXT,
    contract_list TEXT
);

-- Добавление столбца для связи с таблицей заёмщики в таблицу кредиты для организаций
ALTER TABLE orgloans
ADD COLUMN borrower_id INT,
ADD FOREIGN KEY (borrower_id) REFERENCES borrowers(id);

-- Добавление столбца для связи с таблицей заёмщики в таблицу заёмные средства
ALTER TABLE loans
ADD COLUMN borrower_id INT,
ADD FOREIGN KEY (borrower_id) REFERENCES borrowers(id);