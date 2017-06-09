
/*
 * GET home page.
 */
var url = 'mongodb://xr0225:dlql4248@ds060649.mlab.com:60649/student';
var mongoose = require('mongoose'), Slist = require('../app').Slist;
var dbs = mongoose.createConnection(url);
exports.index = function (req, res) {
    res.render('index', { title: 'Express', year: new Date().getFullYear() });
};

exports.about = function (req, res) {
    res.render('about', { title: 'About', year: new Date().getFullYear(), message: 'Your application description page' });
};

exports.contact = function (req, res) {
    res.render('contact', { title: 'Contact', year: new Date().getFullYear(), message: 'Your contact page' });
};
exports.detail = function (req, res) {
    res.render('detail', { title: 'Detail', year: new Date().getFullYear(), message: 'Detail of student'});
};
exports.detail_instructor = function (req, res) {
    res.render('detail_instructor', { title: 'Detail', year: new Date().getFullYear(), message: 'Detail of instructor' });
};
exports.edit = function (req, res) {
    res.render('edit', { title: 'Edit', year: new Date().getFullYear(), message: 'Edit student' });
};
exports.instructor = function (req, res) {
    res.render('instructor', { title: 'Instructor', year: new Date().getFullYear(), message: 'Instructor' });
};
exports.edit_instructor = function (req, res) {
    res.render('edit_instructor', { title: 'Edit a instructor', year: new Date().getFullYear(), message: 'Edit a instructor' });
};

exports.newinstructor = function (req, res) {
    res.render('newinstructor', { title: 'Newinstructor', year: new Date().getFullYear(), message: 'Add a new instructor' });
};
exports.course = function (req, res) {
    res.render('course', { title: 'Course', year: new Date().getFullYear(), message: 'Course list' });
};
exports.detail_course = function (req, res) {
    res.render('detail_course', { title: 'Detail of course', year: new Date().getFullYear(), message: 'Course detail' });
};
exports.edit_course = function (req, res) {
    res.render('edit_course', { title: 'Edit of course', year: new Date().getFullYear(), message: 'Course Edit' });
};
exports.courselist = function (req, res) {
    dbs.collection('courses').find().toArray((err, result) => {
        if (err) return console.log(err)
        console.log(Math.random(1,100));
        res.send({ results: result });
        console.log('data sent');
    });
};
exports.newcourse = function (req, res) {
    res.render('newcourse', { title: 'New Course', year: new Date().getFullYear(), message: 'Add a new course' });
};
exports.class = function (req, res) {
    res.render('class', { title: 'Class', year: new Date().getFullYear(), message: 'Class list' });
};
exports.add_student = function (req, res) {
    res.render('add_student', { title: 'Add a student', year: new Date().getFullYear(), message: 'Student list' });
};



exports.editdata = function (req, res) {
    console.log(req.body.user_id);
    var id = req.body.user_id;
    dbs.collection('infos').find({_id:id}).toArray((err, result) => {
        if (err) return console.log(err)
        console.log(result);
        res.send({ editdata: result });
        console.log('data sent');
    });
};
exports.studentlists = function (req, res) {
    dbs.collection('infos').find().toArray((err, result) => {
        if (err) return console.log(err)
        //console.log(result);
        res.send({ results: result });
        console.log('data sent');
    });
};
exports.instructorlist = function (req, res) {
    dbs.collection('instructors').find().toArray((err, result) => {
        if (err) return console.log(err)
        //console.log(result);
        res.send({ results: result });
        console.log('data sent');
    });
};
exports.instructortemplate = function (req, res) {
    res.sendfile('/instructortemplate');
};
exports.student = function (req, res) {
    res.render('student', { title: 'Student', year: new Date().getFullYear(), message: 'Student List' });
};
exports.newstudent = function (req, res) {
    res.render('newstudent', { title: 'New student registration', year: new Date().getFullYear(), message: 'Add a new student' });
};
