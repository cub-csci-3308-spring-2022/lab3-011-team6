var express = require('express'); //Ensure our express framework has been added
var app = express();
var bodyParser = require('body-parser'); //Ensure our body-parser tool has been added
app.use(bodyParser.json());              // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

//Create Database Connection
var pgp = require('pg-promise')();
var username = "";
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

app.get('/', function (req, res) {
    res.redirect('/login');
})

app.get('/login', function (req, res) {
    res.render('login.ejs', {
        message: "",
    })
});
app.get('/home', function (req, res) {
    res.redirect('/login');
})
app.post('/home', function (req, res) {
    console.log(req.body);
    username = req.body.username;
    var password = req.body.password;
    console.log(typeof username);
    console.log(typeof password);
    var select = 'SELECT * FROM users_db WHERE username = \'' + username + '\' AND pass = \'' + password + '\';';
    db.task('get-everything', task => {
        return task.batch([
            task.any(select),
        ]);
    })
        .then(info => {
            if (info != "") {
                res.render('home.ejs', {
                    username: username
                })
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
app.get('/register', function (req, res) {
    res.render('register.ejs', {
        message: "",
    })
});
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
app.listen(3000);
console.log('3000 is the magic port');