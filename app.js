const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var path=require("path");
var ejs = require("ejs");
const connection = mysql.createConnection({
    host: "localhost",
    username: "root",
    password: "password",
    database:"login"
});
const app = express(); 
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/'));
app.get('/register',function(req,res){
    res.render('index');
});
app.get('/',function(req,res){
    res.render('index');
});
app.get('/login',function(req,res){
    res.render('login');
});
app.get('/train',function(req,res){
    res.render('train');
});
app.get('/history',function(req,res){
    res.render('history');
});
app.set('views',__dirname);
app.set('view engine','ejs');
app.post('/',function(req,res){
    
    var username = req.body.username;
    var password = req.body.password;
    var c_pass = req.body.confirm_password;
    var sql = "INSERT INTO login(`USERNAME`,`PASSWORD`) VALUES ('"+username+"','"+password+"')";
    if(username.length>3 && password.length>5 && c_pass == password){
                connection.query(sql,function(err)
                {
                    if(!err){
                        console.log("Inserted");
                       
                    }else{
                        throw err;
                    }
                    
                });
                connection.end();
        
    
        return res.redirect('/login');
    }
    else{
        res.send('<p>Username>3 characters password>5 characters or password!=confirm password</p>');
    
    }
});
app.post('/login',function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    var sql = "SELECT * FROM login WHERE USERNAME='"+username+"'";
    connection.query(sql,function(err,results,fields){
        if(err){
            throw err;
        }
        else{
            console.log("The solution is : ",results);
            if(results.length > 0){
                if(results[0].PASSWORD == password){
                    return res.redirect('/train');
                }
                else{
                    res.send("Username and password doesnt match");
                }
            }
            else{
                res.send("Username doesnt exist");
            }
        }
    });
    
    
});
connection.query("CREATE TABLE IF NOT EXISTS train(TNAME VARCHAR(255) UNIQUE,SOURCE VARCHAR(255),DEST VARCHAR(255),TNUM INT PRIMARY KEY,SEATS INT NOT NULL)",function(err){
    if(err){
        throw err;
    }
});

app.post('/train',function(req,res) {
    var tname = req.body.tname;
    var source = req.body.source;
    var dest = req.body.destination;
    var seats = req.body.seats;
    var tnum = req.body.tnum;
    
    var sql = "INSERT INTO train VALUES('"+tname+"','"+source+"','"+dest+"','"+tnum+"','"+seats+"')";
    connection.query(sql,function(err){
        if(!err){
            console.log("Inserted");

        }
        else{
            throw err;
        }
    });
    connection.query("SELECT * FROM train",function(err,results,fields){
        if(err){
            throw err;
        }
        else{                    
                 res.render('history.ejs',{ train: results});
              
            }
        
    });

});


app.listen('3360',function(){
    console.log("connected");
});