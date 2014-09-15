/* MWA TRAINING/EVENT LIST API */
var express  		= require('express');	
var bodyParser 		= require("body-parser");								
var app     		= express(); 	
var nodemailer 		= require('nodemailer');	
var smtpTransport 	= require('nodemailer-smtp-transport');									
var mysql 			= require('mysql'); 									
var port  	 		= 8081; 										
var database 		= require('./config/database');
var email			= require('./config/email');
var dateFormat 		= require('dateformat');
var traverse 		= require('traverse');

app.use(bodyParser.json());

app.all('*', function(req, res, next) {
	res.set('Access-Control-Allow-Origin', 'file://');
	res.set('Access-Control-Allow-Credentials', true);
	res.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.set('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	if ('OPTIONS' == req.method) return res.status(200).end();
	next();
});

var transporter = nodemailer.createTransport(smtpTransport(email));



/**********************************************************************
*	ROUTES
**********************************************************************/

/* CLASS LIST ROUTE */
app.get('/api/currentclasses', function(req, res) {
	var result = []; 
	console.log(database.host);
	var connection = mysql.createConnection(database);
	connection.connect(function(err) {
	  	if (err) {
		    console.error('error connecting: ' + err.stack);
		    return;
	  	}
	  console.log('connected as id ' + connection.threadId);
	});	

	var queryString = 'SELECT DISTINCT Class FROM UpcomingTraining ORDER BY Class ASC';
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	 	
	    for (var i in rows) {
	        result.push({
	        	ID: rows[i].id,
	        	Class: rows[i].Class,
	        	StartDate: rows[i].StartDate,
	        	EndDate: rows[i].EndDate
	        });
	    }

		res.contentType('application/json');
		res.send(result);
	});

	connection.end();
	console.log('connection closed');

});

/* CLASS TIME ROUTE */
app.post('/api/classdatetime', function(req, res) {
	var result = []; 

	var connection = mysql.createConnection(database);
	connection.connect(function(err) {
	  	if (err) {
		    console.error('error connecting: ' + err.stack);
		    return;
	  	}
	  console.log('connected as id ' + connection.threadId);
	});	
	//console.log(req.body);
	var queryString = "SELECT StartDate, EndDate FROM UpcomingTraining WHERE Class ='"+ req.body.Class +"'";
	connection.query(queryString, function(err, rows, fields) {
	    if (err) throw err;
	 	
	    for (var i in rows) {
			var start = dateFormat(rows[i].StartDate,"mm/dd/yy, h:MM:ss TT");
			var end = dateFormat(rows[i].EndDate,"mm/dd/yy, h:MM:ss TT");
			//console.log(start);
	        //console.log('Times: ', rows[i].StartDate);
	        result.push({
	        	ID: rows[i].id,
	        	Class: rows[i].Class,
	        	StartDate: rows[i].StartDate,
	        	EndDate: rows[i].EndDate,
				FormattedDate: start+" to "+ end
	        });
	    }

		res.contentType('application/json');
		res.send(result);
	});

	connection.end();
	console.log('connection closed');

});

/* PROCESS ROUTE */
app.post('/api/process', function(req, res) {
	try {	
/*		var test = traverse(req.body).reduce(function (acc, node){
			if (typeof username === 'undefined') {
			    console.log('username missing');
			}
		
		});*/

		var mailOptions = {
		    from: 'FROM EMAIL', // sender address
		    to: req.body.email+',<TO EMAIL>', // list of receivers
		    subject: req.body.selectedClass.Class+' Training - <COMPANY NAME>', // Subject line
		    /*text: 'Hello world ✔', // plaintext body*/
		    html: '<div class="text-center"><h3>For Your Records</h3><hr><div class="row"><div class="col-lg-6"><ul class="confirm-list"><li><label>Name:&nbsp;</label>'+req.body.name+'</li><li><label>Company:&nbsp;</label>'+req.body.company+'</li><li><label>Email:&nbsp;</label>'+req.body.email+'</li><li><label>Phone#:&nbsp;</label>'+req.body.phoneno+'</li></ul></div><div class="col-lg-6"><ul class="confirm-list"><li><label>Address:&nbsp;</label>'+req.body.address+'</li><li><label>State:&nbsp;</label>'+req.body.state+'</li><li><label>City:&nbsp;</label>'+req.body.city+'</li><li><label>Zipcode:&nbsp;</label>'+req.body.zipcode+'</li></ul></div></div><hr><div class="row"><div class="col-lg-12"><ul class="confirm-list"><li><label>Class:&nbsp;</label>'+req.body.selectedClass.Class+'</li><li><label>Start Date:&nbsp;</label>'+req.body.selectedDateTime.StartDate+'</li><li><label>End Date:&nbsp;</label>'+req.body.selectedDateTime.EndDate+'</li></ul></div></div><hr></div>'
		};

		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		    	console.log('email failure');
		        console.log(error);
		        res.contentType('application/json');
				res.send('email-failure')
		    }else{
		    	console.log('Message sent: ' + info.response);
		    	res.contentType('application/json');
				res.send('success')
		    }
		});
	}
	catch (e) {
		res.send('failure')
	}
});



/* LISTEN */
app.listen(port);
console.log("App listening on port " + port);