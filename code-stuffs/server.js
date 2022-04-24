// Anna - Set up server.js file
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();

const dbConfig = {
    host: 'db',
    port: 5432,
    database: 'project-db',
    user: 'postgres',
    password: 'pwd'
};

var db = pgp(dbConfig);

// Anna - Creating unit test data
const test_users = [
    {
        username: "arahn",
        password: "pass123"
    },
    {
        username: "caker",
        password: "strongpass"
    }
];

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

var username;
var check1;
var check2;
var check3;
var check4;
var check5;

/* Al - Just a quick redirect
app.get('/', function (req, res) {
    var username;
    var check1;
    var check2;
    var check3;
    var check4;
    var check5;
    res.redirect('/login');
})
*/

//For first test case
app.get("/", (req, res) => {
    res.json({status: "success", message: "Welcome!"})
})

// Al - Login Get (Upon reaching this page, all variables are reset)
app.get('/login', function (req, res) {
    var username;
    var check1;
    var check2;
    var check3;
    var check4;
    var check5;
    res.render('login.ejs', {
        message: "",
    })
});
// Al - Login Post (Displays a message if login is invalid and redirects the user. Otherwise renders the home page)
app.post('/login', function (req, res) {
    username = req.body.username;
    var password = req.body.password;
    var select = 'SELECT * FROM users_db WHERE username = \'' + username + '\' AND pass = \'' + password + '\';';
    db.task('get-everything', task => {
        return task.batch([
            task.any(select),
        ]);
    })
        .then(info => {
            if (info != "") {
                res.redirect('/home');
            }
            else {
                res.render('login.ejs', {
                    message: "'No such account exists. Please try again or create a new account.'"
                })
            }
        })
        .catch(err => {
            console.log('error', err);
        });
});

// Al - Register Get
app.get('/register', function (req, res) {
    res.render('register.ejs', {
        message: "",
    })
});

// Al - Register Post, takes in all info on the page, only submits if passwords match and user has not been created
app.post('/register', function (req, res) {
    var uname = req.body.uname;
    var pass = req.body.pword;
    check1 = req.body.genre1;
    check2 = req.body.genre2;
    check3 = req.body.genre3;
    check4 = req.body.genre4;
    check5 = req.body.genre5;

    var genres = [];

    if (typeof (check1) !== "undefined") {
        genres.push("\"Computers\"");
        check1 = true;
    }
    else { check1 = false; }
    if (typeof (check2) !== "undefined") {
        genres.push("\"Juvenille Fiction\"");
        check2 = true;
    }
    else { check2 = false; }

    if (typeof (check3) !== "undefined") {
        genres.push("\"Fiction\"");
        check3 = true;
    }
    else { check3 = false; }

    if (typeof (check4) !== "undefined") {
        genres.push("\"Boston\"");
        check4 = true;
    }
    else { check4 = false; }

    if (typeof (check5) !== "undefined") {
        genres.push("\"Medical\"");
        check5 = true;
    }
    else { check5 = false; }


    var select = 'SELECT * FROM users_db WHERE username = \'' + uname + '\';';
    var insert_statement = 'INSERT INTO users_db (username, pass, genres) VALUES (\'' + uname + '\',\'' + pass + '\',\'{' + genres + '}\')';
    console.log(insert_statement);
    db.task('get-everything', task => {
        return task.batch([
            task.any(select),
        ]);
    })
        .then(info => {
            if (info == "") {
                db.task('get-everything', task => {
                    return task.batch([
                        task.any(insert_statement),
                    ]);
                })

                res.render('login.ejs', {
                    message: "'Account Created Sucessfully!'"
                })
            }
            else {
                res.render('register.ejs', {
                    message: "'Account with that username already exists, try again.'"
                })
            }
        })
        .catch(err => {
            console.log('error', err);
        });
});
// Anna - Home Get (autopopulates cards)
app.get('/home', function (req, res) {
    var query = 'SELECT * FROM books_db LIMIT 10;';

    db.task('get-everything', task => {
        return task.batch([
            task.any(query)
        ]);
    })
        .then(info => {
            console.log("HOME THEN INFO")
            console.log(info)
            res.render('home.ejs', {
                my_title: "Home Page",
                items: info[0]
            })
        })
        .catch(err => {
            console.log("HOME ERR")
            console.log(err)
            res.render('home.ejs', {
                my_title: "Home Page",
                items: ''
            })
        });
});

// app.get('/search', function (req, res) {
//     console.log("SEARCH LANDING")
//     res.render('search_landing.ejs', {
//         message: "",
//     })
// });

app.get('/search', function (req, res) {
    console.log("SEARCH PAGE")
    var title = req.query.search_input;

    console.log("SEARCH TITLE: " + title);
    var options = 'SELECT * FROM books_db;';
    var query = 'SELECT * FROM books_db WHERE title LIKE \'' + title + '\';';

    db.task('get-everything', task => {
        return task.batch([
            task.any(options),
            task.any(query)
        ]);
    })
        .then(info => {
            console.log("SEARCH THEN INFO")
            console.log(info)
            res.render('search.ejs', {
                my_title: "Search Page",
                items: info[1]
            })
        })
        .catch(err => {
            console.log("SEARCH ERR")
            console.log(err)
            res.render('search.ejs', {
                my_title: "Search Page",
                items: ''
            })
        });
});

app.get('/search/:title', function (req, res) {
    console.log("SEARCH PAGE TITLE", req.query, req.params)
    var title = req.query.q;
    console.log("SEARCH TITLE: " + title);
    var options = 'SELECT * FROM books_db;';
    var query = 'SELECT * FROM books_db WHERE title LIKE \'%' + title + '%\';';

    db.task('get-everything', task => {
        return task.batch([
            task.any(options),
            task.any(query)
        ]);
    })
        .then(info => {
            console.log("SEARCH THEN INFO")
            console.log(info)
            res.render('search.ejs', {
                my_title: "Search Page",
                items: info[1]
            })
        })
        .catch(err => {
            console.log("SEARCH ERR")
            console.log(err)
            res.render('search.ejs', {
                my_title: "Search Page",
                items: ''
            })
        });
});
//Al - Profile GET greets the user and displays currently selected genre preferences
app.get('/profile', function (req, res) {
    res.render('profile', {
        username: username,
        check1: check1,
        check2: check2,
        check3: check3,
        check4: check4,
        check5: check5
    })
});
//Al - Profile POST lets the user update their genre preferences
app.post('/profile', function (req, res) {
    check1 = req.body.genres1;
    check2 = req.body.genres2;
    check3 = req.body.genres3;
    check4 = req.body.genres4;
    check5 = req.body.genres5;

    var genres = [];

    if (typeof (check1) !== "undefined") {
        genres.push("\"Computers\"");
        check1 = true;
    }
    else { check1 = false; }
    if (typeof (check2) !== "undefined") {
        genres.push("\"Juvenille Fiction\"");
        check2 = true;
    }
    else { check2 = false; }

    if (typeof (check3) !== "undefined") {
        genres.push("\"Fiction\"");
        check3 = true;
    }
    else { check3 = false; }

    if (typeof (check4) !== "undefined") {
        genres.push("\"Boston\"");
        check4 = true;
    }
    else { check4 = false; }

    if (typeof (check5) !== "undefined") {
        genres.push("\"Medical\"");
        check5 = true;
    }
    else { check5 = false; }
    var update = 'UPDATE users_db SET genres = \'{' + genres + '}\' WHERE username = \'' + username + '\';';
    var select = 'SELECT * FROM users_db WHERE username = \'' + username + '\';';
    console.log(update);
    db.task('get-everything', task => {
        return task.batch([
            task.any(update),
            task.any(select)
        ]);
    })
        .then(info => {
            console.log(info[1]);
            res.render('profile', {
                username: username,
                check1: check1,
                check2: check2,
                check3: check3,
                check4: check4,
                check5: check5
            })
        })
        .catch(err => {
            console.log(error);
        });
});

app.get('/search', function (req, res) {
    res.render('search.ejs', {
        message: "",
    })
});

//Cody + Abigail - Recommendations GET (autopopulates cards and determines if there is a user logged in. If there is no user logged in, it shows some overall recommendations)
app.get('/recommendations', function (req, res) {
    console.log("REC PAGE")
    var booksAndGenres = 'SELECT * FROM books_db;';
    var book_genre = 'SELECT DISTINCT category FROM books_db;';
    db.task('get-everything', task => {
        return task.batch([
            task.any(booksAndGenres),
            task.any(book_genre),
        ]);

    })

        .then(info => {
            console.log("INFO")
            console.log(info)
            res.render('recommendations.ejs', {
                my_title: "Recommendations Page",
                items: info[0],
                book_genre: info[1],
                bookinfo: ''
            })
        })

        .catch(err => {
            console.log('error', err.stack);
            res.render('recommendations.ejs', {
                my_title: "Recommendations Page",
                items: info[0],
                book_genre: info[1],
                bookinfo: ''
            })
        });
});

app.get('/recommendations/:genre', function (req, res) {
    console.log("SELECT GENRE PAGE")
    console.log(req.query, req.params);
    var booksAndGenres = 'SELECT * FROM books_db;';
    var book_genre = 'SELECT DISTINCT category FROM books_db;';
    db.task('get-everything', task => {
        return task.batch([
            task.any(booksAndGenres),
            task.any(book_genre),
        ]);

    })

        .then(info => {
            console.log("INFO")
            console.log(info)
            res.render('recommendations.ejs', {
                my_title: "Recommendations Page",
                items: info[0],
                book_genre: info[1],
                bookinfo: ''
            })
        })

        .catch(err => {
            console.log('error', err.stack);
            res.render('recommendations.ejs', {
                my_title: "Recommendations Page",
                items: info[0],
                book_genre: info[1],
                bookinfo: ''
            })
        });
});

//Abigail - Recommendations Get Genre
app.get('/recommendations/genre', function (req, res) {
    console.log("REC GENRE 3")
    var book_genre = 'SELECT DISTINCT category FROM books_db;';
    var genre_choice = req.query.books;
    var book = 'SELECT * FROM books_db WHERE category = \'' + genre_choice + '\' LIMIT 10;';

    db.task('get-everything', task => {
        return task.batch([
            task.any(book_genre),
            task.any(book)
        ]);
    })
        .then(info => {
            res.render('pages/recommendations', {
                my_title: "Recommendations Page",
                bookinfo: data[2][1],
                book_genre: data[0]
            })
        })
        .catch(error => {
            console.log('error', err.stack);
            req.flash('error', err);
            res.render('pages/recommendations', {
                my_title: "Recommendations Page",
                bookinfo: '',
                book_genre: ''
            })
        });
});
app.listen(3000);
console.log('3000 is the magic port');
