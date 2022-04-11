-- CREATE DATABASE books_db;
-- LOAD DATA INFILE '/init_data/google_books_dataset.csv'
-- INTO TABLE books_db
-- FIELDS TERMINATED BY ','
-- ENCLOSED BY '"'
-- LINES TERMINATED BY '\n';

-- CREATE TABLE books_db (
--   id SERIAL,
--   title VARCHAR(255),
--   authors VARCHAR(255),
--   language VARCHAR(255),
--   categories VARCHAR(255),
--   averageRating VARCHAR(255),
--   maturityRating VARCHAR(255),
--   publisher VARCHAR(255),
--   publishedDate VARCHAR(255),
--   PRIMARY KEY (id)
-- )


-- COPY books_db(id,title,authors,language,categories,averageRating,maturityRating,publisher,publishedDate)
-- FROM 'google_books_dataset.csv'
-- DELIMITER ','
-- CSV HEADER;