-- CREATE DATABASE books_db;
-- LOAD DATA INFILE '/init_data/google_books_dataset.csv'
-- INTO TABLE books_db
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';

CREATE TABLE IF NOT EXISTS books_db (
    title VARCHAR(30) PRIMARY KEY,
    category VARCHAR(30)
);

INSERT INTO books_db(title, category)
VALUES ('Inward Journey', 'Medical'),
('The Boston Directory', 'Boston')
;