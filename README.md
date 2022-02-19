# NextPage

## Application Overview
NextPage provides recommendations for readers based on their previous reading material. Users can rate books they have previously read, and receive recommendations based on their rating, combined with their previous ratings. To get started, NextPage will ask a few questions about the genres and kinds of books the user is interested in and begin recommending other books. The user will be able to mark book as “read” in order to stop receiving recommendations, and further refine their recommendations. 

  In order to make the algorithm improve itself, readers will be able to mark recommendations as interesting or not interesting, which will make similar readers receive more consistent recommendations. Readers will also be able to leave reviews with a star feedback system as well as comment their thoughts. A search algorithm may also be implemented in order to help readers narrow their recommendations faster. NextPage will be the ultimate book finding tool for bookworms and casual readers alike. 

## Architecture Overview
  We will use HTML to develop the structure and primary content of the website. This includes the individual books’ pages (with descriptions and reviews), the main feed of recommendations, the user’s account page, and more. Then, we will use CSS to format and stylize each of the webpages. In order to animate features of our website, such as button clicks and pop-ups, we will use JavaScript. Each of these are front-end technologies. 

  On the server side, we will use Node.js to create the server the website will be hosted on and develop the login. Registered users will be stored in a database, along with their preferences, ratings, previously read books/authors, and reviews. We will manage this database by integrating PostgreSQL into Node.js. 

The application will be accessible on Heroku. 

### Architecture Diagram
https://www.edrawmax.com/online/share.html?code=44f33c6a885f11ec968d0a54be41f961
