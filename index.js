/*
	Robert Johnson
	CIT 253
	Project 6
*/

var express = require('express');
const { int } = require('nunjucks/src/filters');
var app = express();

app.use(express.json())               // <-- angularjs sends json data 
app.use(express.urlencoded({ extended: true }));

var Student = require('./modules/Student.js');  // our Student model

app.use(express.static('public'))       // serve static files


app.use('/showAll', function(req, res) {   // Retrieve all
                                             
    Student.find( function(err, students) {   
		 if (err) {
		     res.status(500).send(err);
		 }
		 else {
			 res.send(students);  
		 }
    });
})


app.post('/addStudent', function(req, res){    // Create a new student object
	var newStudent = new Student ({               
		sid: req.body.sid,     
		first_name: req.body.first_name,
		last_name: req.body.last_name,
		midterm: req.body.midterm,
		final: req.body.final,
		major: req.body.major,
	});
	try {
		newStudent.save( function(err) {       // same the new student
			if (err) {
				res.status(500).send(err);
			}
			else {
				res.send("Student successfully added.");  
			}
	   }); 
	} catch (err) {
		console.error("invalid entry");
		alert("Invalid Entry. Please check all fields and try again.")
	}
});



app.post('/updateStudent', function(req, res) { 

    var update_sid = req.body.sid;
    var updateMidterm = req.body.midterm;
	var updateFinal = req.body.final;

	try {
		Student.findOne( {sid: update_sid}, function(err, student) {  
			if (err) {
				res.status(500).send(err);
			}
			else if (!student) {
				res.send('No student with a sid of ' + update_sid);
			}
			else {
				student.midterm = updateMidterm;
				student.final = updateFinal;
			
				student.save(function (err) {
					if(err) {
						res.status(500).send(err);
					}
				});
				res.send("Update successful");
		   }
		});        
	} catch(err) {
		console.error(err);
	}
    

});


app.get('/deleteStudent', function(req, res) {   //  Delete
	 var delete_sid = req.query.sid;       //sid is unique, 
	 ///console.log(delete_sid)
	 Student.findOneAndRemove({sid: delete_sid}, function(err, student) {  // 
		if (err) {
		    res.status(500).send(err);
		}
		else if (!student) {
		    res.send('No student with a sid of ' + delete_sid);
		}
		else {
		    res.send("Student sid: " + delete_sid + " deleted."); 
		}
    });         
});


app.listen(3000,  function() {
	console.log('Listening on port 3000, ctrl-c to quit');
    });
