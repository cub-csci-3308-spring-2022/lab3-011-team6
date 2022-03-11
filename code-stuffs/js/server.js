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
	database: 'users_db',
	user: 'postgres',
	password: 'pwd'
};

var db = pgp(dbConfig);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.post('/registration', function(req, res) {
	var username = req.body.username;
	var pass = req.body.pword;

	var insert_statement = 'INSERT INTO users_db (username, pass) VALUES (\'' + username + '\',\'' +  pass + '\');'; // Write a SQL statement to insert a color into the favorite_colors table
	// var color_select = 'SELECT * FROM favorite_colors;' // Write a SQL statement to retrieve all of the colors in the favorite_colors table

	db.task('get-everything', task => {
        return task.batch([
            task.any(insert_statement),
            task.any(color_select)
        ]);
    })
    .then(info => {
    	res.render('pages/home',{
				my_title: "Home Page",
				data: info[1], // Return the color choices
				color: info[1][0].hex_value, // Return the hex value of the color added to the table
				color_msg: info[1][0].color_msg// Return the color message of the color added to the table
			})
    })
    .catch(err => {
            console.log('error', err);
            res.render('pages/home', {
                my_title: 'Home Page',
                data: '',
                color: '',
                color_msg: ''
            })
    });
});