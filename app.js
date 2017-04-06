// dependencies
var http = require("http");
var express = require("express");
var app = express();
var path = require('path')
var bodyParser = require('body-parser');
var moment = require('moment');
var julian = require('julian');


// init the view engine
app.set('view engine', 'ejs');


// set up body parser for parsing requests and
// configure router.
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(app.router);


// setup public folder access to the css and
// js can be served
app.use(express.static('public'))


app.get("/", function (req, res) {
  let today = moment().local().format("MM/DD/YYYY");
  res.render("index", {
    result: getJulianDay(today)//,
    //todaysDate: today
  });
});


app.post("/", function (req, res) {

  let date = req.body.calendarDate;
  let format = req.body.format;

  var result = format == "date" ?
               getJulianDate(date) :
               getJulianDay(date);

  res.render("index", {
    result: result.toString(),
    todaysDate: moment().format("MM/DD/YYYY")
   });
});


app.get('/api/getJulianDay', function(req, res) {
  res.json({
    result: getJulianDay(req.query.date)
  });
});


app.get('/api/getJulianDate', function(req, res) {
  res.json({
    result: getJulianDate(req.query.date)
  });
});


let getJulianDay = function (date) {

  let dt = moment(date, 'MM/DD/YYYY').utc();
  let year = dt.year();

  let dayOfYear = moment(date, 'MM/DD/YYYY')
                        .format("DDD");

  let dayFormatted = dayOfYear <= 9 ?
                    ("00" + dayOfYear) :
                    dayOfYear <= 99 ? ("0" + dayOfYear) : dayOfYear;

  return (year.toString().substring(2, 4)) +
          dayFormatted.toString();
}


let getJulianDate = function (date) {
  let day = moment(date, "MM/DD/YYYY").utc().startOf('day');
  return julian(day);
}


// start server
http.createServer(app).listen(8080);
