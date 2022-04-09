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

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/login', function (req, res) {
    res.render('login.ejs', {
        message: "",
    })
});
app.post('/login', function (req, res) {
    var username = req.body.uname;
    var pass = req.body.pword;

    var select = "SELECT * FROM users_db WHERE username = '" + username + "' AND password = '" + pass + "';";
});
app.get('/register', function (req, res) {
    res.render('register.ejs', {
        message: "",
    })
});
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

app.get('/home', function (req, res) {
    query = 'SELECT * FROM books_db';
    db.any(query)
        .then(function (rows){
            console.log(rows);
            res.render('home.ejs', {
                items: query
            })
        })
        .catch(function (rows){
            console.log(rows);
            res.render('home.ejs', {
                items: query
            })
        })
    }
);

app.listen(3000);
console.log('3000 is the magic port');