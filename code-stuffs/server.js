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

app.get("/", (req, res) => {
    res.json({status: "success", message: "Welcome!"})
})

// Al - Login Get
app.get('/login', function (req, res) {
    res.render('login.ejs', {
        message: "",
    })
});

// Al - Login Post
app.post('/login', function (req, res) {
    var username = req.body.uname;
    var pass = req.body.pword;

    var select = "SELECT * FROM users_db WHERE username = '" + username + "' AND password = '" + pass + "';";
});

// Al - Register Get
app.get('/register', function (req, res) {
    res.render('register.ejs', {
        message: "",
    })
});

// Al - Register Post
app.post('/register', function (req, res) {
    var username = req.body.uname;
    var pass = req.body.pword;

    var select = 'SELECT * FROM users_db WHERE username = \'' + username + '\';';
    var insert_statement = 'INSERT INTO users_db (username, pass) VALUES (\'' + username + '\',\'' + pass + '\');';
    db.task('get-everything', task => {
        return task.batch([
            task.any(select),
        ]);
    })
        .then(info => {
            if (info == "") {
                //console.log("NO EXIST");
                //console.log(info);
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
                //console.log("EXISTS");
                //console.log(info);
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
    var query = 'SELECT * FROM books_db;';

	db.task('get-everything', task => {
        return task.batch([
            task.any(query)
        ]);
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

//Cody - Recommendations GET (autopopulates cards and determines if there is a user logged in. If there is no user logged in, it shows some overall recommendations)
app.get('/recommendations', function(req, res) {
    var valuesCards = [];
    if(typeof(username) !== 'undefined'){
        var genre = 'SELECT category FROM users_db WHERE username = ' + username + ';';
        var books =  'SELECT * FROM books_db WHERE category IN ' + genre + ' ORDER BY rating DESC LIMIT 10;';
    
        db.task('get-everything', task => {
            return task.batch([
                task.any(genre),
                task.any(books),
                task.any(ratings)
            ]);
        })

        .then(info => {
            console.log("INFO")
            console.log(info)
            res.render('recommendations.ejs', {
                my_title: "Recommendations Page",
                items:info[0]
            
            })
        })
        .catch(err => {
            console.log('error', err);
        });
    }
    else{
        var booksAndGenres = 'SELECT * FROM books_db;';
    
        db.task('get-everything', task => {
            return task.batch([
                task.any(booksAndGenres),
            ]);
            
        })

        .then(info => {
            console.log("INFO")
            console.log(info)
            res.render('recommendations.ejs', {
                my_title: "Recommendations Page",
                items:info[0]
            })
        })

        .catch(err => {
            console.log('error', err.stack);
        });
    }

});

//Abigail - Recommendations Get Genre
app.get('/recommendations/genre', function(req,res) {
    var genre_choice = req.query.genre_selecton;
	var book_options =  'select categort from books_db;';
	var books = "select * from books_db where category = '" + genre_choice + "';";
	db.task('get-everything', task => {
		return task.batch([
			task.any(book_options),
			task.any(books)
		]);
	})
		.then(info => {
			res.render('views/recommendations',{
				my_title: "Recommendations Page",
				items: info[0],
				genre_choice: genre_choice,
				books: info[1][0].books
			})
		})
		.catch(error => {
			// display error message in case an error
			request.flash('error', err);
			response.render('views/recommendations', {
				my_title: 'Recommendations Page',
				items: '',
				genre_choice: '',
				books: ''
			})
		});
});
app.listen(3000);
console.log('3000 is the magic port');