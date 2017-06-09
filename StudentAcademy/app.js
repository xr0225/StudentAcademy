/**
 * Module dependencies.
 */

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var app = express();
var bodyParser = require('body-parser');
var assert = require('assert');
var url = 'mongodb://xr0225:dlql4248@ds060649.mlab.com:60649/student';
var promise = require('bluebird');
mongoose.connect(url);
var dbs = mongoose.connection;
dbs.on('error', console.error.bind(console, 'connection error:'));
dbs.once('open', function () {
    console.log('Database connected');
});
var studentlist = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    DOB: { type: Date, required: true, default: Date.now },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    parents: {
        name: { type: String, required: false },
        phone: { type: Number, requird: false },
        email: { type: String, required: false }
    },
    class: { type: String, required: true }
});
var instructorlist = mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    DOB: { type: Date, required: true, default: Date.now },
    email: { type: String, required: true },
    phone: { type: Number, required: true },
    address: { type: String, required: true },
    dateofstart: { type: Date, required: true },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "clist"
    }]
});
var courselist = mongoose.Schema({
    coursename: { type: String, required: true },
    coursenumber: { type: String, required: true },
    coursecredit: { type: Number, required: true },
    courseroom: { type: String, required: false },
    courseregisteddate: { type: Date, default: Date.now },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "slist"
    }],
    instructors: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ilist"
    }]
});
var room = mongoose.Schema({
    roomname: { type: String, required: true },
    roombuilding: { type: String, required: true },
    coursecredit: { type: String, required: true },
    courseroom: { type: String, required: false }
});

var ilist = mongoose.model('instructor', instructorlist);
var slist = mongoose.model('info', studentlist);
var clist = mongoose.model('course', courselist);

module.exports.Slist = slist;
module.exports.Schema = studentlist;


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/about', routes.about);
app.get('/contact', routes.contact);
app.get('/student', routes.student);
app.get('/newstudent', routes.newstudent);
app.get('/detail', routes.detail);
app.get('/detail_instructor', routes.detail_instructor);
app.get('/studentlists', routes.studentlists);
app.get('/edit', routes.edit);
app.get('/edit_instructor', routes.edit_instructor);
app.get('/editdata', routes.editdata);
app.get('/instructor', routes.instructor);
app.get('/newinstructor', routes.newinstructor);
app.get('/instructorlist', routes.instructorlist);
app.get('/instructortemplate', routes.instructortemplate);
app.get('/course', routes.course);
app.get('/courselist', routes.courselist);
app.get('/detail_course', routes.detail_course);
app.get('/edit_course', routes.edit_course);
app.get('/newcourse', routes.newcourse);
app.get('/class', routes.class);
app.get('/add_student', routes.add_student);


app.post('/students', (req, res) => {
    if (!req.body) return console.log("No data sent");
    var newstudent = new slist(req.body);
    //console.log(req.body);
    newstudent.save(function (err) {
        if (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
            res.status(200);
            console.log('a new student was registered!');
            res.redirect('/');
        }
    });
});

app.post('/editstudent', (req, res) => {
    if (!req.body) return console.log("No data sent");
    //console.log(req.body);
    //console.log(req.body._id);
    slist.findOneAndUpdate({ _id: req.body._id }, req.body, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
            res.status(200);
            console.log('Student information updated!');
            res.redirect('/student');
        }
    });
});
app.post('/editinstructor', (req, res) => {
    if (!req.body) return console.log("No data sent");
    //console.log(req.body);
    //console.log(req.body._id);
    ilist.findOneAndUpdate({ _id: req.body._id }, req.body, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
            res.status(200);
            console.log('instructor information updated!');
            res.redirect('/instructor');
        }
    });
});
app.post('/editcourse', (req, res) => {
    if (!req.body) return console.log("No data sent");
    clist.findOneAndUpdate({ _id: req.body._id }, req.body, function (err, result) {
        if (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
            res.status(200);
            console.log('Course information updated!');
            res.redirect('/course');
        }
    });
});

app.post('/newcourse', (req, res) => {
    if (!req.body) return console.log("No data sent");
    ilist.findOne({ name: req.body.iname }).select('_id').
        exec(function (err, instructors) {
            if (!err) {
                if (instructors) {
                    var instructor;
                    //console.log(instructors.name);
                    //console.log(instructors._id);
                    var newcourse = new clist({
                        'coursename': req.body.coursename, 'coursenumber': req.body.coursenumber, 'coursecredit': req.body.coursecredit
                        , 'courseroom': req.body.room, 'instructors': instructors._id
                    });

                    //'instructors.name': req.body.iname, 'instructors.email': instructors.email, 'instructors.phone': instructors.phone, 'instructors.role': req.body.role
                    newcourse.save(function (err) {
                        if (err) {
                            res.status(400);
                            res.send(err);
                        }
                        else {
                            ilist.update({ name: req.body.iname }, // find a document with that filter
                                { $push: { 'courses': newcourse._id } }, // document to insert when nothing was found
                                { upsert: true, runValidators: true }, // options
                                function (err, doc) { // callback
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        console.log(doc);
                                    }
                                }
                            );
                            res.status(200);
                            res.redirect('/course');
                        }
                    });
                }
                else {
                    res.status(400);
                    res.send("Could not find instructor");
                }
            }
            else {
                res.status(400);
                res.send(err);
            }
        });
});
app.post('/instructors', (req, res) => {
    if (!req.body) return console.log("No data sent");
    var newinstructor = new ilist(req.body);
    //console.log(req.body);
    newinstructor.save(function (err) {
        if (err) {
            console.log(err);
            res.status(400);
            res.send(err);
        }
        else {
            res.status(200);
            console.log('a new instructor was registered!');
            res.redirect('/instructor');
        }
    });
});
app.post('/delete', (req, res) => {
    var type = req.body.category;
    var id = req.body._id;
    var ObjectId = require('mongoose').ObjectID;
    if (type == 'student') {
        slist.deleteOne({ _id: id }, (err, result) => {
            if (err) return console.log(err);
            console.log('The selected student has been deleted from database');
            res.json({ success: true });
        });
    } else if (type == 'instructor') {
        clist.update(
            { instructors: { $in: [id] } },
            { $pull: { instructors: mongoose.Types.ObjectId(id) } },
            {
                multi: true
            },
            function (error, success) {
                if (error) {
                    console.log("error", error)

                }
                console.log("success", success)

            });
        ilist.deleteOne({ _id: id }, (err, result) => {
            if (err) return console.log(err);
            console.log('The selected instructor has been deleted from database');
            res.json({ success: true });
        });
    } else if (type == 'course') {
        ilist.update(
            { courses: { $in: [id] } },
            { $pull: { courses: mongoose.Types.ObjectId(id) } },
            {
                multi: true
            },
            function (error, success) {
                if (error) {
                    console.log("error", error);
                }
                console.log("success", success);
            });
        clist.deleteOne({ _id: id }, (err, result) => {
            if (err) return console.log(err);
            console.log('The selected instructor has been deleted from database');
            res.json({ success: true });
        });
    }
});
app.post('/detail', (req, res) => {
    var name = req.body.name;
    var age = req.body.age;

    slist.find({ name: name, age: age }).exec(function (err, result) {
        if (err) return console.log(err);
        res.send({ detail: result });
        console.log('working');
    });
});
app.post('/courselist', (req, res) => {
    var id = req.body.id;

    ilist.findOne({ _id: id }).populate('courses').exec(function (err, result) {
        if (err) return console.log(err);
        res.send({ course: result });
        console.log('Course sent');
    });
});
app.post('/detail_instructor', (req, res) => {
    var name = req.body.name;
    var age = req.body.age;

    ilist.find({ name: name, age: age }).exec(function (err, result) {
        if (err) return console.log(err);
        res.send({ detail: result });
        console.log('working');
    });
});
app.post('/detailcourse', (req, res) => {
    var name = req.body.coursename;
    var number = req.body.coursenumber;

    clist.find({ coursename: name, coursenumber: number }).exec(function (err, result) {
        if (err) return console.log(err);
        res.send({ detail: result });
        console.log('working');
    });
});

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'
//app.listen(app.get('port'));
app.listen(server_port, server_ip_address, function () {
    console.log("Listening on " + server_ip_address + ", port " + server_port)
});
/*http.createServer(app).listen(app.get('port'), function (res, req) {
    console.log('Express server listening on port ' + app.get('port'));
});*/



