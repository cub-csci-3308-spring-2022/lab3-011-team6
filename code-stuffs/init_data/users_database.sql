--DROP TABLE IF EXISTS users_db CASCADE;--
CREATE TABLE IF NOT EXISTS users_db
(
    username VARCHAR (30) PRIMARY KEY,
    pass VARCHAR (16),
    genres VARCHAR[]
);

CREATE TABLE IF NOT EXISTS books_db(
    title VARCHAR(30) PRIMARY KEY,
    category VARCHAR(30)
);