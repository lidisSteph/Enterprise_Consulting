var express = require('express')
var bodyParser = require("body-parser");
var date = require('date-and-time')
var https = require("https")
var http = require('http')
var fs = require('fs'), xml2js = require('xml2js')
var parser = new xml2js.Parser();
var $ = require('jquery')

var app = express()

process.env.PORT = process.env.PORT || 8001;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
http.createServer(app).listen(8001, () => {
  console.log('Server started at http://localhost:8001');
});


app.get("/latest/:id", async function (req, res) {
  if (req.params.id){

      var now = new Date()
      var today = date.format(now, 'YYYY-MM-DD')
      var a = JSON.parse(extraccion)

      var valores = a[0].Cube.find(function (e, arr) {
        return e["$"].time == today
      });


      var currency = req.params.id.toUpperCase()
      var currToday = valores.Cube.find(function (e, arr) {
        return e["$"].currency == currency

      });

      var currRest = [];
      valores.Cube.forEach(function (e, arr) {
        if (e["$"].currency !== currency) {
          currRest.push(e["$"])
        }


      });

      console.log(valores)
      console.log('Currency hoy: ' + JSON.stringify(currToday))
      console.log('Currency resto: ' + JSON.stringify(currRest))

      valores.Cube.forEach(function (curr, arr) {
        console.log(curr)
      });




      var registro = {}
      currRest.forEach(function (e, arr) {
        var cambio = 1 / (currToday["$"].rate) * e.rate
        registro[e.currency] = parseFloat(cambio.toFixed(4))


      });

      console.log(registro)
      var o = {
        "base": currency,
        "date": date.format(now, 'MM-DD-YYYY'),
        "rate": registro
      }


      res.send(JSON.stringify(o));
    }
  
});



var extraccion ={}
var data = '';
https.get("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml", function (res) {
  if (res.statusCode >= 200 && res.statusCode < 400) {
    res.on('data', function (data_) { data += data_.toString(); });
    res.on('end', function () {
          parser.parseString(data, function (err, result) {
            extraccion = JSON.stringify(result["gesmes:Envelope"]["Cube"]);



      });
    });
  }
});