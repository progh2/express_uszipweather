
var path = require("path");
var express = require("express");
var zipdb = require("zippity-do-dah");
var ForecastIo = require("forecastio");

var app = express();
var weather = new ForecastIo("94a7b65d51a395e9b1b2ca1b1c23b9c9");

app.use(express.static(path.resolve(__dirname, "public")));

app.set("views", path.resolve(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/", function(req, res){
  res.render("index");
});

app.get(/^\/(\d{5})$/, function(req, res, next){

  var zipcode = req.params[0];
  console.log("입력된 숫자" + zipcode);
  var location = zipdb.zipcode(zipcode);

  if(!location.zipcode){
    next();
    return;
  }
  console.log(JSON.stringify(location));
  var latitude = location.latitude;
  var longitude = location.longitude;
  console.log("lat:" + latitude + " / " + "lng:" + longitude);

  weather.forecast(latitude, longitude, function(err, data){
    if(err){
      console.log("weather forecast error" + err);
      next();
      return;
    }
    res.json({
      zipocde : zipcode,
      lat: latitude,
      lng: longitude,
      temperature: data.currently.temperature
    })
  });
});

app.use(function(req, res){
  res.status(404).render("404");
});

app.listen(3000);
