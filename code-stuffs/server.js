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

app.get('/', function (req, res) {
    res.redirect('/login');
})

// Al - Login Get
app.get('/login', function (req, res) {
    res.render('login.ejs', {
        message: "",
    })
});
// Al - Login Post
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

// Al - Register Post
app.post('/register', function (req, res) {
    var uname = req.body.uname;
    var pass = req.body.pword;
    var check1 = req.body.genre1;
    var check2 = req.body.genre2;
    var check3 = req.body.genre3;
    var check4 = req.body.genre4;
    var check5 = req.body.genre5;

    var genre1 = "";
    var genre2 = "";
    var genre3 = "";
    var genre4 = "";
    var genre5 = "";

    var genres = [];

    if (typeof (check1) !== "undefined") { genres.push("\"Computers\"") }
    if (typeof (check2) !== "undefined") { genres.push("\"Juvenille Fiction\"") }
    if (typeof (check3) !== "undefined") { genres.push("\"Fiction\"") }
    if (typeof (check4) !== "undefined") { genres.push("\"History\"") }
    if (typeof (check5) !== "undefined") { genres.push("\"Business & Economics\"") }

    var select = 'SELECT * FROM users_db WHERE username = \'' + uname + '\';';
    var insert_statement = 'INSERT INTO users_db (username, pass, genres) VALUES (\'' + uname + '\',\'' + pass + '\',\'{' + genres + '}\')';
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
    .then (info => {
        console.log("HOME THEN INFO")
        console.log(info)
        res.render('home.ejs', {
            my_title: "Home Page",
            items:info[0]
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
    .then (info => {
        console.log("SEARCH THEN INFO")
        console.log(info)
        res.render('search.ejs', {
            my_title: "Search Page",
            items:info[1]
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
    .then (info => {
        console.log("SEARCH THEN INFO")
        console.log(info)
        res.render('search.ejs', {
            my_title: "Search Page",
            items:info[1]
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

app.get('/profile', function(req, res) {
    res.render('profile',{
	    username:username,
    })
});

//Abigail - Recommendations Get
app.get('/recommendations', function(req, res) {
    res.render('recommendations',{
    })
    .then (info => {
        console.log("INFO")
        console.log(info)
        res.render('home.ejs', {
            my_title: "Home Page",
            items:info[0]
        })
    })
    .catch(err => {
        console.log("ERR")
        console.log(err)
        res.render('home.ejs', {
            my_title: "Home Page",
            items: ''
        })
    });
});

app.get('/search', function (req, res) {
    res.render('search.ejs', {
        message: "",
    })
});

app.get('/profile', function(req, res) {
    res.render('profile',{
	    username: username,
    })
});

//Abigail - Recommendations Get
app.get('/recommendations', function(req, res) {
    res.render('recommendations',{
    })
});

//Abigail - Recommendations Get Genre
app.get('/recommendations/genre', function(req,res) {
    var genre_choice = req.query.genre_selecton;
	var book_options =  'select categories from books_db;';
	var books = "select * from books_db where categories = '" + genre_choice + "';";
	db.task('get-everything', task => {
		return task.batch([
			task.any(book_options),
			task.any(books)
		]);
	})
		.then(info => {
			res.render('views/recommendations',{
				my_title: "Recommendations Page",
				data: info[0],
				genre_choice: genre_choice,
				books: info[1][0].books
			})
		})
		.catch(error => {
			// display error message in case an error
			request.flash('error', err);
			response.render('views/recommendations', {
				my_title: 'Recommendations Page',
				data: '',
				genre_choice: '',
				books: ''
			})
		});
});

//Abigail - Recommendations Get Genre
app.get('/recommendations/genre', function(req,res) {
    var genre_choice = req.query.genre_selecton;
	var book_options =  'select categories from books_db;';
	var books = "select * from books_db where categories = '" + genre_choice + "';";
	db.task('get-everything', task => {
		return task.batch([
			task.any(book_options),
			task.any(books)
		]);
	})
		.then(info => {
			res.render('views/recommendations',{
				my_title: "Recommendations Page",
				data: info[0],
				genre_choice: genre_choice,
				books: info[1][0].books
			})
		})
		.catch(error => {
			// display error message in case an error
			request.flash('error', err);
			response.render('views/recommendations', {
				my_title: 'Recommendations Page',
				data: '',
				genre_choice: '',
				books: ''
			})
		});
});
app.listen(3000);
console.log('3000 is the magic port');
