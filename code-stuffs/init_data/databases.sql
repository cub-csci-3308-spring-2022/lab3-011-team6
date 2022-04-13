--DROP TABLE IF EXISTS users_db CASCADE;--
CREATE TABLE IF NOT EXISTS users_db
(
    username VARCHAR (30) PRIMARY KEY,
    pass VARCHAR (16),
    genres VARCHAR[]
);

CREATE TABLE IF NOT EXISTS books_db (
    title VARCHAR(150) PRIMARY KEY,
    category VARCHAR(50)
);

INSERT INTO books_db(title, category)
VALUES ('Inward Journey', 'Medical'),
('The Boston Directory', 'Boston'),
('Implementing the IT Balanced Scorecard', 'Computers'),
('Handbook of Applied Developmental Science', 'Psychology'),
('Social Software Engineering', 'Computers'),
('Data Modeling Essentials', 'Computers'),
('Sams Teach Yourself Perl in 21 Days', 'Computers'),
('Science and the Riddle of Consciousness', 'Computers'),
('The Physics of VLSI Systems', 'Computers'),
('Programming with Python', 'Computers'),
('Effective Python', 'Computers'),
('Text Processing in Python', 'Computers')
; 
