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
	database: 'project_db',
	user: 'postgres',
	password: 'pwd'
};

var db = pgp(dbConfig);

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/register', function(req, res) {
    res.render('register.ejs',{
        error_msg: ""
    })
});
app.post('/register', function(req, res) {
	var username = req.body.username;
	var pass = req.body.pword;

    var exists = false;
    var select = 'SELECT * FROM users_db WHERE username = ' + username + ';';
	var insert_statement = 'INSERT INTO users_db (username, pass) VALUES (\'' + username + '\',\'' +  pass + '\');'; 
	db.task('get-everything', task => {
        return task.batch([
            task.any(select),
        ]);
    })
    .then(info => {
        if(info!= {}){
            exists = true;
            console.log("EXISTS");
            res.render('/register',{
                error_msg: "Username " + username + " already exists.",
            })
        }
        else{
            console.log("NO EXIST");
        }
    	//res.render('../html_stuffs/login.html',{
				//my_title: "Home Page",
			//})
    })
    .catch(err => {
            console.log('error', err);
    });

    if(!exists){    //If there are no other users with the same username
        db.task('get-everything', task => {
            return task.batch([
                task.any(insert_statement),
            ]);
        })
        .then(info => {
            res.render('/login',{
                    //my_title: "Registration",
                })
        })
        .catch(err => {
                console.log('error', err);
        });
    }
});
app.get('/recommendations', function(req, res) {
    var valuesCards = [];
    var genre = 'SELECT categories FROM users_database WHERE user == ' + curr_user + ';';
	var books =  'SELECT title FROM google_books_dataset WHERE categories == ' + genre + ' ORDER BY rating DESC 10;';
	var ratings = 'Select averagRating FROM googgle_books_dataset ORDER BY rating DESC 10;;';
	db.task('get-everything', task => {
        return task.batch([
            task.any(genre),
            task.any(books),
            task.any(ratings)
        ]);
    })
    .then(info => {
    	res.render('/recommendations',{
				my_title: "Home Page",
				data: info[0], // Return the color options
				color: info[1][0].hex_value, // Return the color choice
				color_msg: info[1][0].color_msg, // Return the color message
			})
        for(let i = 0; i < books.length; i++){
            var array = {title: books[i], rating: ratings[i]};
            valuesCards.push(array);
        }
            
        
    })
    .catch(err => {
        console.log('error', err);
    });

});

app.listen(3000);
console.log('3000 is the magic port');