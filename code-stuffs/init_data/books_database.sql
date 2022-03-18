CREATE DATABASE books_db;
BULK INSERT books_db.books FROM 'books.csv' WITH (FORMAT = 'CSV');