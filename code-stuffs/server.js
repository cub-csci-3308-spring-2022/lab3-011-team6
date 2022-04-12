// Anna - Set up server.js file
var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
const fs = require("fs"); // Allowing us to import data from csv files
const fastcsv = require("fast-csv");
const Pool = require("pg").Pool;

let stream = fs.createReadStream("init_data/google_books_dataset.csv");
let csvData = [];
let csvStream = fastcsv
    .parse()
    .on("data", function(data)
    {
        csvData.push(data);
    })
    .on("end", function()
    {
        // remove the first line (the header)
        csvData.shift();
        const dbConfig = {
            host: 'db',
            port: 5432,
            database: 'project-db',
            user: 'postgres',
            password: 'pwd'
        };
        const query = "INSERT INTO category (title, categories) VALUES ($1, $2);";
        dbConfig.connect((err, client, done) => {
            if (err) throw err;
            try {
                csvData.forEach(row => {
                    client.query(query, row, (err, res) => {
                        if (err) {
                            console.log(err.stack);
                        } else {
                            console.log("inserted " + res.rowCount + " row: ", row);
                        }
                    });
                });
            } finally {
                done();
            }
        })
    });
    stream.pipe(csvStream);
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
//Create Database Connection
var pgp = require('pg-promise');

// const dbConfig = {
//     host: 'db',
//     port: 5432,
//     database: 'project-db',
//     user: 'postgres',
//     password: 'pwd'
// };

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

// Al, Anna - Register Post
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

app.get('/profile', function(req, res) {
    res.render('profile',{
    })
});

app.get('/recommendations', function(req, res) {
    res.render('recommendations',{
    })
});

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