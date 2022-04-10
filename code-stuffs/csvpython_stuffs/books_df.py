# Anna - A quick script to test datasets and find relevant information
import pandas as pd

# title, authors, average rating, isbn, isbn13, language, num_pages, num ratings, publisher
#books_df1 = pd.read_csv("books.csv")

# title, author, rating, num reviews, price, year published, genre (fiction vs nonfiction)
book_df2 = pd.read_csv("amazon_bestsellers.csv")

book_df3 = pd.read_csv("google_books_dataset.csv").drop("publishedDate", axis = 1).drop("publisher", axis = 1).drop("maturityRating", axis = 1).drop("averageRating", axis = 1).dropna()

print(book_df3)

for idx, row in book_df3.iterrows():
    if ("History" in book_df3.loc[idx].at["categories"]):
        print(book_df3.loc[idx].at["title"])