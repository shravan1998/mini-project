const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
var ejs = require("ejs");
var path = require("path");
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
app.get('/clerk',function(req,res){
    res.render('clerk');
});
app.get('/admin',function(req,res){
    res.render('admin');
});
app.get('/passenger',function(req,res){
    res.render('passenger');
});
app.get('/station',function(req,res){
    res.render('station');
});
app.get('/passhistory',function(req,res){
    res.render('passhistory');
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
connection.query("CREATE TABLE IF NOT EXISTS clerk(F_NAME VARCHAR(255) UNIQUE,L_NAME VARCHAR(255) UNIQUE,COUNTER_NUM INT PRIMARY KEY)",function(err){
    if(err){
        throw err;
    }
});
app.post('/clerk',function(req,res){
    var fname = req.body.firstname;
    var lname = req.body.lastname;
    var counter = req.body.counter;
    sql="INSERT INTO clerk VALUES('"+fname+"','"+lname+"','"+counter+"')";
    connection.query(sql,function(err){
    if(err){
        throw err;
    }
    });
    
});
/*connection.query("ALTER TABLE train ADD AVAIL_SEATS INT",function(err){
    if(err){
        throw err;
    }
});*/
connection.query("CREATE TABLE IF NOT EXISTS admin(F_NAME VARCHAR(255) UNIQUE,L_NAME VARCHAR(255) UNIQUE,APP_NUM INT PRIMARY KEY,SUB_DATE DATE NOT NULL)",function(err){
    if(err){
        throw err;
    }
});
app.post('/admin',function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var appnum = req.body.appnum;
    var subdate = req.body.subdate;
    var sql = "INSERT INTO admin VALUES('"+fname+"','"+lname+"','"+appnum+"','"+subdate+"')";
    connection.query(sql,function(err){
        if(err){
            throw err;
        }
    });
});
connection.query("CREATE TABLE IF NOT EXISTS station(PLATFORM INT,T_ARRIVE TIME,T_DEPART TIME,TNUM INT,FOREIGN KEY(TNUM) REFERENCES train(TNUM))",function(err){
    if(err){
        throw err;
    }
});
app.post('/station',function(req,res){
    var pnum = req.body.pnum;
    var atime = req.body.atime;
    var dtime = req.body.dtime;
    var tnum = req.body.tnum;
    var sql="INSERT INTO station VALUES('"+pnum+"','"+atime+"','"+dtime+"','"+tnum+"')";
    connection.query(sql,function(err){
        if(err){
            throw err;
        }
    });
});
//connection.query("CREATE TABLE passenger(F_NAME VARCHAR(255) UNIQUE,L_NAME VARCHAR(255) UNIQUE,COMPTMENT VARCHAR(255),TIC_NUM INT PRIMARY KEY,SUB_DATE DATE,SUB_TIME TIME,APP_NUM INT,CNUM INT,USER_ID INT,FOREIGN KEY(APP_NUM) REFERENCES admin(APP_NUM) ON DELETE CASCADE,FOREIGN KEY(CNUM) REFERENCES clerk(COUNTER_NUM) ON DELETE CASCADE,FOREIGN KEY(USER_ID) REFERENCES login(USER_ID) ON DELETE CASCADE)",function(err){
  //  if(err){
    //    throw err;
   // }
//});
app.post('/passenger',function(req,res){
    var fname = req.body.fname;
    var lname = req.body.lname;
    var comp = req.body.comp;
    var tnum = req.body.tnum;
    var subdate = req.body.sub_date;
    var subtime = req.body.sub_time;
    var appnum = req.body.appnum;
    var cnum = req.body.cnum;
    var uid = req.body.uid;
    var train_num = req.body.train_num;
    var sql="INSERT INTO passenger VALUES('"+fname+"','"+lname+"','"+comp+"','"+tnum+"','"+subdate+"','"+subtime+"','"+appnum+"','"+cnum+"','"+uid+"','"+train_num+"')";
    connection.query(sql,function(err){
        if(err){
            throw err;
        }
    connection.query("SELECT * FROM passenger",function(err,results,fields){
            if(err){
                throw err;
            }
            else{
                res.render('passhistory.ejs',{passengers: results});
            }
        });
    });
});
//connection.query("ALTER TABLE passenger ADD COLUMN TNUM INT",function(err){
 //   if(err){
//     throw err;
  //  }
//});
//connection.query("ALTER TABLE passenger ADD CONSTRAINT fk_tnum FOREIGN KEY(TNUM) REFERENCES train(TNUM)",function(err){
 //   if(err){
 //       throw err;
 //   }
//});
connection.query("UPDATE TABLE train SET train.AVAIL_SEATS=train.SEATS-COUNT(passenger.TNUM) FROM train,passenger)",function(err){
    if(err){
        throw err;
    }
});
app.listen('3360',function(){
    console.log("connected");
});