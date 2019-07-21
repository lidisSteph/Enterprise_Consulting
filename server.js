var express = require('express')
var bodyParser = require("body-parser");
var date = require('date-and-time')
var https = require("https")
var http = require('http')
var fs = require('fs'), xml2js = require('xml2js')
var parser = new xml2js.Parser();
var $ = require('jquery')
var bVRegx = /([\w]{3}) - ([\w]{3})/

var app = express()

process.env.PORT = process.env.PORT || 8001;

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

 
http.createServer(app).listen(8001, () => {
  console.log('Server started at http://localhost:8001');
});




app.get("/historical/:base-:versus", async function (req, res) {
	

	if ((typeof req.params.base == 'string' && req.params.base.length == 3) && (typeof req.params.versus == 'string' && req.params.versus.length == 3)) {
		var base = req.params.base.toUpperCase()
		var versus = req.params.versus.toUpperCase()

		var dt = new Date(req.query.date)
		var date_p = date.format(dt, 'YYYY-MM-DD')
		console.log(req.query.date)
		var st = new Date(req.query.start)
		var start = date.format(st, 'YYYY-MM-DD')
		var en = new Date(req.query.end)
		var end = date.format(en, 'YYYY-MM-DD')
		var now = new Date()
		var today = date.format(now, 'YYYY-MM-DD')

		var a = JSON.parse(extraccion)
		var rangoFechas = []
		var rangoCurrency = []
		var registro = {}
		
		
		if (req.query.date) {
			///////////////////////////////////////////////
			
			var currFecha = a[0].Cube.find(function (e, arr) {
				return e["$"].time = date_p
			});

			
			if (base == 'EUR' && versus =='EUR') {

				var o = {
					"base": base,
					"versus": versus,
					"date": date.format(dt, 'MM-DD-YYYY'),
					"rate": 1
				}
				console.log(o)
				res.send(JSON.stringify(o));

			}else if(base == 'EUR'){
				var currVersus = currFecha.Cube.find(function (e, arr) {
					return e["$"].currency == versus
				});
				
				if (currVersus) {
					var o = {
						"base": base,
						"versus": versus,
						"date": date.format(dt, 'MM-DD-YYYY'),
						"rate": parseFloat(currVersus["$"].rate)
					}
					console.log(o)
					res.send(JSON.stringify(o));
				}else{
					res.send('No se encuentra la moneda '+versus)
				}
			}else if(versus == 'EUR'){
				var currBase = currFecha.Cube.find(function (e, arr) {
					return e["$"].currency == base
				});
				
				if (currBase) {
					var cambio = 1 / currBase["$"].rate
					var o = {
						"base": base,
						"versus": versus,
						"date": date.format(dt, 'MM-DD-YYYY'),
						"rate": parseFloat(cambio.toFixed(4))
					}
					console.log(o)
					res.send(JSON.stringify(o));
				} else {
					res.send('No se encuentra la moneda ' + base)
				}
			}else{
				
				var currBase = currFecha.Cube.find(function (e, arr) {
					return e["$"].currency == base
				});
				
				if(currBase){
					var currVersus = currFecha.Cube.find(function (e, arr) {
						return e["$"].currency == versus
					});
				
					if (currVersus) {
						var cambio = (1 / currBase["$"].rate) * currVersus["$"].rate
						
						var o = {
							"base": base,
							"versus": versus,
							"date": date.format(dt, 'MM-DD-YYYY'),
							"rate": parseFloat(cambio.toFixed(4))
						}
						console.log(o)
						res.send(JSON.stringify(o));
	
					}else{
						res.send('No se encuentra la moneda ' + versus)	
					}
				}else{
					res.send('No se encuentra la moneda ' + base)	
				}
			}

			//////////////////////////////////////////////////
		}else{
			a[0].Cube.forEach(function (e, arr) {
				var dateF = new Date(e["$"].time)
				var dateE = date.format(dateF, 'YYYY-MM-DD')

				if (dateE >= start && dateE <= end) {
					rangoFechas.push(e["$"].time)
					rangoCurrency.push(e)
				} 
			});

			rangoFechas.sort();
			if (rangoFechas.length != 0) {
				if (base == 'EUR' && versus == 'EUR') {
					rangoFechas.forEach(function (da, arr) {

						var an = new Date(da)
						var f = date.format(an, 'MM-DD-YYYY')
						registro[f] = 1



					});
					var o = {
						"base": base,
						"versus": versus,
						"start": date.format(st, 'MM-DD-YYYY'),
						"end": date.format(en, 'MM-DD-YYYY'),
						"rates": registro
					}
					console.log(o)
					res.send(JSON.stringify(o));
				} else if (base == 'EUR') {
					var flag = 1
					rangoFechas.forEach(function (da, arr) {
						var fechaE = rangoCurrency.find(function (e, arr) {
							return e["$"].time == da
						})
						var currVersus = fechaE.Cube.find(function (e, arr) {
							return e["$"].currency == versus

						})

						if (!currVersus) {
							flag = 0
						} else {

							var an = new Date(da)
							var f = date.format(an, 'MM-DD-YYYY')
							registro[f] = parseFloat(currVersus["$"].rate)


						}
					})
					if (flag == 1) {
						var o = {
							"base": base,
							"versus": versus,
							"start": date.format(st, 'MM-DD-YYYY'),
							"end": date.format(en, 'MM-DD-YYYY'),
							"rates": registro
						}
						console.log(o)
						res.send(JSON.stringify(o));
					} else {
						res.send('La moneda ' + versus + ' no se encuentra')
					}


				} else if (versus == 'EUR') {
					var flag = 1
					rangoFechas.forEach(function (da, arr) {
						var fechaE = rangoCurrency.find(function (e, arr) {
							return e["$"].time == da
						})
						var currBase = fechaE.Cube.find(function (e, arr) {
							return e["$"].currency == base

						})

						if (!currBase) {
							flag = 0
						} else {
							var cambio = 1 / currBase["$"].rate

							var an = new Date(da)
							var f = date.format(an, 'MM-DD-YYYY')
							registro[f] = parseFloat(cambio.toFixed(4))


						}
					})
					if (flag == 1) {
						var o = {
							"base": base,
							"versus": versus,
							"start": date.format(st, 'MM-DD-YYYY'),
							"end": date.format(en, 'MM-DD-YYYY'),
							"rates": registro
						}
						console.log(o)
						res.send(JSON.stringify(o));
					} else {
						res.send('La moneda ' + versus + ' no se encuentra')
					}

				} else {

					rangoFechas.forEach(function (da, arr) {

						var fechaE = rangoCurrency.find(function (e, arr) {
							return e["$"].time == da
						})
						var currBase = fechaE.Cube.find(function (e, arr) {
							return e["$"].currency == base

						})

						if (!currBase) {
							flag = 0
						} else {
							var currVersus = fechaE.Cube.find(function (e, arr) {
								return e["$"].currency == versus
							})

							if (!currVersus) {
								flag = 2
							} else {
								var cambio = (1 / currBase["$"].rate) * currVersus["$"].rate
								var d = new Date(da)
								d.setDate(d.getDate() + 1)
								registro[date.format(d, 'MM-DD-YYYY')] = parseFloat(cambio.toFixed(4))

							}

						}
					})

					if (flag == 0) {
						res.send('La moneda ' + base + ' no se encuentra')
					} else {
						if (flag == 2) {
							res.send('La moneda ' + versus + ' no se encuentra')

						} else {
							var o = {
								"base": base,
								"versus": versus,
								"start": date.format(st, 'MM-DD-YYYY'),
								"end": date.format(en, 'MM-DD-YYYY'),
								"rates": registro
							}
							console.log(o)
							res.send(JSON.stringify(o));

						}
					}

				}

			} else {
				res.send('No hay divisas en el rango de ' + start + ' a ' + end)
			}	
		}
		
	} else {
		
	}
	
});





app.get("/latest/:base-:versus", async function (req, res) {
	

	if ((typeof req.params.base == 'string' && req.params.base.length == 3) && (typeof req.params.versus == 'string' && req.params.versus.length == 3)) {
		var base = req.params.base.toUpperCase()
		var versus = req.params.versus.toUpperCase()
			
		var now = new Date()
		var today = date.format(now, 'YYYY-MM-DD')
		var a = JSON.parse(extraccion)
		

		var valores = a[0].Cube.find(function (e, arr) {
			return e["$"].time == '2019-07-19'
		});

		if (versus == 'EUR' && base == 'EUR') {
			var o = {
				"base": base,
				"versus": versus,
				"date": date.format(now, 'MM-DD-YYYY'),
				"rate": 1
			}
			console.log(o)
			res.send(JSON.stringify(o));

		} else if(base == 'EUR'){
			

			var currVersus = valores.Cube.find(function (e, arr) {
				return e["$"].currency == versus

			});

			if (!currVersus) {
				res.send('La moneda '+versus+' no se encuentra')
			}else{
				var o = {
					"base": base,
					"versus": versus,
					"date": date.format(now, 'MM-DD-YYYY'),
					"rate": parseFloat(currVersus["$"].rate)
				}


				console.log(o)
				res.send(JSON.stringify(o));

			}
			


		}else if(versus == 'EUR'){
			var currBase = valores.Cube.find(function (e, arr) {
				return e["$"].currency == base

			});
			if (!currBase) {
				res.send('La moneda ' + base + ' no se encuentra')
			}else{

				var cambio = 1 / currBase["$"].rate
				var o = {
					"base": base,
					"versus": versus,
					"date": date.format(now, 'MM-DD-YYYY'),
					"rate": parseFloat(cambio.toFixed(4))
				}
				console.log(o)
				res.send(JSON.stringify(o));

			}		
		
		}else{


			var currBase = valores.Cube.find(function (e, arr) {
				return e["$"].currency == base
			});
			if (!currBase) {
				res.send('La moneda ' + base + ' no se encuentra')
			}else{

				var currVersus = valores.Cube.find(function (e, arr) {
					return e["$"].currency == versus
				});

				if (!currVersus) {
					res.send('La moneda ' + versus + ' no se encuentra')
					
				}else{
					var cambio = (1 / currBase["$"].rate) * currVersus["$"].rate
					var o = {
						"base": base,
						"versus": versus,
						"date": date.format(now, 'MM-DD-YYYY'),
						"rate": parseFloat(cambio.toFixed(4))
					}
					console.log(o)
					res.send(JSON.stringify(o));

				}
			}
			
			
		}
	} else {
		res.send('Escriba una moneda de 3 letras');
	}

});

app.get("/latest/:id", async function (req, res) {
 
  if (typeof req.params.id == 'string' && req.params.id.length == 3 ) {

    var now = new Date()
    var today = date.format(now, 'YYYY-MM-DD')
    var a = JSON.parse(extraccion)
	var currency = req.params.id.toUpperCase()
	

    var valores = a[0].Cube.find(function (e, arr) {
      return e["$"].time == '2019-07-19'
    });

    if (currency == 'EUR') {
      var registro = {}
      valores.Cube.forEach(function (e, arr) {      
        registro[e["$"].currency] = parseFloat(e["$"].rate)
      });

      var o = {
        "base": currency,
        "date": date.format(now, 'MM-DD-YYYY'),
        "rates": registro
      }


		console.log(o)
		res.send(JSON.stringify(o));
    }else{
        var currToday = valores.Cube.find(function (e, arr) {
          return e["$"].currency == currency

        });

        if (currToday) {

          var currRest = [];
          valores.Cube.forEach(function (e, arr) {
            if (e["$"].currency !== currency) {
              currRest.push(e["$"])
            }


          });

        /*  console.log(valores)
          console.log('Currency hoy: ' + JSON.stringify(currToday))
          console.log('Currency resto: ' + JSON.stringify(currRest))*/

        /*  valores.Cube.forEach(function (curr, arr) {
            console.log(curr)
          });*/




          var registro = {}
          currRest.forEach(function (e, arr) {
            var cambio = 1 / (currToday["$"].rate) * e.rate
            registro[e.currency] = parseFloat(cambio.toFixed(4))


		  });
		var EURO = 1 / (currToday["$"].rate)
		registro["EUR"] = parseFloat(EURO.toFixed(4))

          //console.log(registro)
          var o = {
            "base": currency,
            "date": date.format(now, 'MM-DD-YYYY'),
            "rates": registro
          }


			console.log(o)
			res.send(JSON.stringify(o));
      } else {
        res.send('No se encuentra ésta moneda')
      }

    }
    
    
  } else{
	  res.send('Escriba una moneda de 3 letras');
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