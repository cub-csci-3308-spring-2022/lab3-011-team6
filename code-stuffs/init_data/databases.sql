--DROP TABLE IF EXISTS users_db CASCADE;--
CREATE TABLE IF NOT EXISTS users_db
(
    username VARCHAR (30) PRIMARY KEY,
    pass VARCHAR (16),
    genres INT[]
);

CREATE TABLE IF NOT EXISTS books_db (
    title VARCHAR(30) PRIMARY KEY,
    category VARCHAR(30)
);

INSERT INTO books_db(title, category)
VALUES ('Inward Journey', 'Medical'),
('The Boston Directory', 'Boston')
; 

-- CREATE TABLE IF NOT EXISTS books_db (
--     title VARCHAR(30) PRIMARY KEY,
--     category VARCHAR (30)
-- );
-- COPY books_db
-- FROM 'google_books_dataset.csv'
-- DELIMITER ',';