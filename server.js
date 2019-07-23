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


app.post("/inicio", function (req, res){
	var now = new Date()
	var today = date.format(now, 'YYYY-MM-DD')
	var a = JSON.parse(extraccion)
	var currency = {}
	var valores = a[0].Cube.find(function (e, arr) {
		return e["$"].time == today
	});
	valores.Cube.forEach(function (e, arr){
		currency[e["$"].currency] = e["$"].currency
	});


	currency['EUR'] = 'EUR'
	console.log(currency)

	

	res.send(currency)
});

app.post("/historical",  function (req, res) {
	//var dt = new Date(req.query.date)
	//var date_p = date.format(dt, 'YYYY-MM-DD')
	//console.log(req.query.date)
	var base = req.body.base
	var versus  = req.body.versus
	console.log('base: '+base+' versus: '+versus)
	var tipo = req.body.fecha
	var now = new Date()
	var st = new Date()
	// var mes = new Date()
	// var meses = new Date()
	
	// mes.setDate(mes.getDate() - 30)
	// meses.setDate(meses.getDate() - 90)
	var start 
	if (tipo==1) {
		st.setDate(st.getDate() - 7)
	}else if(tipo == 2){
		st.setDate(st.getDate() - 30)
	}else if(tipo == 3){
		st.setDate(st.getDate() - 90)
	}

	var end = date.format(now, 'YYYY-MM-DD')
	
	var start = date.format(st, 'YYYY-MM-DD')
	//var startMonths = date.format(meses, 'YYYY-MM-DD')
	//console.log('start: '+start+' end: '+end)
	var a = JSON.parse(extraccion)
	var rangoFechas = []
	var rangoCurrency = []
	var registro = []

	//res.send(start)
	// var en = new Date(req.query.end)
	// var end = date.format(en, 'YYYY-MM-DD')
	// var now = new Date()
	// var today = date.format(now, 'YYYY-MM-DD')
	var days = []
	//var d = new Date();
	var weekday = new Array(7);
	weekday[0] = "Sunday";
	weekday[1] = "Monday";
	weekday[2] = "Tuesday";
	weekday[3] = "Wednesday";
	weekday[4] = "Thursday";
	weekday[5] = "Friday";
	weekday[6] = "Saturday";
	//if (tipo == 1) {
		if(base == versus){

			a[0].Cube.forEach(function (e, arr) {
				var dateF = new Date(e["$"].time)
				dateF.setDate(dateF.getDate() + 1)
				var dateE = date.format(dateF, 'YYYY-MM-DD')
				//console.log(dateE)


				if (dateE >= start && dateE <= end) {
					rangoFechas.push(e["$"].time)
					days.push(weekday[dateF.getDay()])
					rangoCurrency.push(e)
				}
			});
			rangoFechas.sort()
			days.reverse()
			//console.log(rangoCurrency)
			//console.log(rangoFechas)
			//console.log(days)


			rangoFechas.forEach(function (fech, arr) {
				/*var currency = rangoCurrency.find(function(e, arr){
					return e["$"].time == fech
				})*/
				registro.push(1)

			});
			// console.log("buahhhh "+registro)
			// var o = {
			// 	"days": days,
			// 	"valor": registro
			// }
			// res.send(o)
		}else if(base == 'EUR'){

			a[0].Cube.forEach(function (e, arr) {
				var dateF = new Date(e["$"].time)
				dateF.setDate(dateF.getDate() + 1)
				var dateE = date.format(dateF, 'YYYY-MM-DD')
				//console.log(dateE)


				if (dateE >= start && dateE <= end) {
					rangoFechas.push(e["$"].time)
					days.push(weekday[dateF.getDay()])
					rangoCurrency.push(e)
				}
			});
			rangoFechas.sort()
			days.reverse()
			// console.log(rangoCurrency)
			// console.log(rangoFechas)
			// console.log(days)


			rangoFechas.forEach(function (fech, arr) {
				var currency = rangoCurrency.find(function(e, arr){
					return e["$"].time == fech
				})
				var currVersus = currency.Cube.find(function(e, arr){
					return e["$"].currency == versus
				})
				registro.push(currVersus["$"].rate)

			});

		}else if(versus == 'EUR'){
			a[0].Cube.forEach(function (e, arr) {
				var dateF = new Date(e["$"].time)
				dateF.setDate(dateF.getDate() + 1)
				var dateE = date.format(dateF, 'YYYY-MM-DD')
				//console.log(dateE)


				if (dateE >= start && dateE <= end) {
					rangoFechas.push(e["$"].time)
					days.push(weekday[dateF.getDay()])
					rangoCurrency.push(e)
				}
			});
			rangoFechas.sort()
			days.reverse()

			rangoFechas.forEach(function (fech, arr) {
				var currency = rangoCurrency.find(function (e, arr) {
					return e["$"].time == fech
				})
				var currBase = currency.Cube.find(function (e, arr) {
					return e["$"].currency == base
				})
				registro.push(1/currBase["$"].rate)

			});

		}else{
			a[0].Cube.forEach(function (e, arr) {
				var dateF = new Date(e["$"].time)
				dateF.setDate(dateF.getDate() + 1)
				var dateE = date.format(dateF, 'YYYY-MM-DD')
				//console.log(dateE)


				if (dateE >= start && dateE <= end) {
					rangoFechas.push(e["$"].time)
					days.push(weekday[dateF.getDay()])
					rangoCurrency.push(e)
				}
			});
			rangoFechas.sort()
			days.reverse()

			rangoFechas.forEach(function (fech, arr) {
				var currency = rangoCurrency.find(function (e, arr) {
					return e["$"].time == fech
				})
				var currBase = currency.Cube.find(function (e, arr) {
					return e["$"].currency == base
				})
				var currVersus = currency.Cube.find(function (e, arr) {
					return e["$"].currency == versus
				})

				registro.push((1 / currBase["$"].rate) * currVersus["$"].rate)

			});
		}
	// } else if(tipo==2){
	// 	if (base == versus) {

	// 		a[0].Cube.forEach(function (e, arr) {
	// 			var dateF = new Date(e["$"].time)
	// 			dateF.setDate(dateF.getDate() + 1)
	// 			var dateE = date.format(dateF, 'YYYY-MM-DD')


	// 			if (dateE >= startWeek && dateE <= end) {
	// 				rangoFechas.push(e["$"].time)
	// 				days.push(weekday[dateF.getDay()])
	// 				rangoCurrency.push(e)
	// 			}
	// 		});
	// 		rangoFechas.sort()
	// 		days.reverse()
	// 		//console.log(rangoCurrency)
	// 		//console.log(rangoFechas)
	// 		//console.log(days)


	// 		rangoFechas.forEach(function (fech, arr) {
	// 			/*var currency = rangoCurrency.find(function(e, arr){
	// 				return e["$"].time == fech
	// 			})*/
	// 			registro.push(1)

	// 		});
	// 		// console.log("buahhhh "+registro)
	// 		// var o = {
	// 		// 	"days": days,
	// 		// 	"valor": registro
	// 		// }
	// 		// res.send(o)
	// 	} else if (base == 'EUR') {

	// 		a[0].Cube.forEach(function (e, arr) {
	// 			var dateF = new Date(e["$"].time)
	// 			dateF.setDate(dateF.getDate() + 1)
	// 			var dateE = date.format(dateF, 'YYYY-MM-DD')
	// 			//console.log(dateE)


	// 			if (dateE >= startWeek && dateE <= end) {
	// 				rangoFechas.push(e["$"].time)
	// 				days.push(weekday[dateF.getDay()])
	// 				rangoCurrency.push(e)
	// 			}
	// 		});
	// 		rangoFechas.sort()
	// 		days.reverse()
	// 		// console.log(rangoCurrency)
	// 		// console.log(rangoFechas)
	// 		// console.log(days)


	// 		rangoFechas.forEach(function (fech, arr) {
	// 			var currency = rangoCurrency.find(function (e, arr) {
	// 				return e["$"].time == fech
	// 			})
	// 			var currVersus = currency.Cube.find(function (e, arr) {
	// 				return e["$"].currency == versus
	// 			})
	// 			registro.push(currVersus["$"].rate)

	// 		});

	// 	} else if (versus == 'EUR') {
	// 		a[0].Cube.forEach(function (e, arr) {
	// 			var dateF = new Date(e["$"].time)
	// 			dateF.setDate(dateF.getDate() + 1)
	// 			var dateE = date.format(dateF, 'YYYY-MM-DD')
	// 			//console.log(dateE)


	// 			if (dateE >= startWeek && dateE <= end) {
	// 				rangoFechas.push(e["$"].time)
	// 				days.push(weekday[dateF.getDay()])
	// 				rangoCurrency.push(e)
	// 			}
	// 		});
	// 		rangoFechas.sort()
	// 		days.reverse()

	// 		rangoFechas.forEach(function (fech, arr) {
	// 			var currency = rangoCurrency.find(function (e, arr) {
	// 				return e["$"].time == fech
	// 			})
	// 			var currBase = currency.Cube.find(function (e, arr) {
	// 				return e["$"].currency == base
	// 			})
	// 			registro.push(1 / currBase["$"].rate)

	// 		});

	// 	} else {
	// 		a[0].Cube.forEach(function (e, arr) {
	// 			var dateF = new Date(e["$"].time)
	// 			dateF.setDate(dateF.getDate() + 1)
	// 			var dateE = date.format(dateF, 'YYYY-MM-DD')
	// 			//console.log(dateE)


	// 			if (dateE >= startWeek && dateE <= end) {
	// 				rangoFechas.push(e["$"].time)
	// 				days.push(weekday[dateF.getDay()])
	// 				rangoCurrency.push(e)
	// 			}
	// 		});
	// 		rangoFechas.sort()
	// 		days.reverse()

	// 		rangoFechas.forEach(function (fech, arr) {
	// 			var currency = rangoCurrency.find(function (e, arr) {
	// 				return e["$"].time == fech
	// 			})
	// 			var currBase = currency.Cube.find(function (e, arr) {
	// 				return e["$"].currency == base
	// 			})
	// 			var currVersus = currency.Cube.find(function (e, arr) {
	// 				return e["$"].currency == versus
	// 			})

	// 			registro.push((1 / currBase["$"].rate) * currVersus["$"].rate)

	// 		});
	// 	}
	// }else if(tipo == 3){

	// }
	console.log(registro)
	var o = {
		"days": days,
		"valor": registro,
		"fechas": rangoFechas
	}
	res.send(o)
	
	
	
});





app.post("/latest", async function (req, res) {

	if (req.body.base == req.body.versus) {
		var a = {
			'base': req.body.base,
			'vBase': req.body.vBase,
			'versus': req.body.versus,
			'vVersus': req.body.vBase,
		}
	} else if (req.body.base == 'EUR'){
		var versus = req.body.versus
		var vBase = parseFloat(req.body.vBase)
		var vVersus = parseFloat(req.body.vVersus)
		var now = new Date()
		var today = date.format(now, 'YYYY-MM-DD')
		var a = JSON.parse(extraccion)

		var valores = a[0].Cube.find(function (e, arr) {
			return e["$"].time == today
		});
		
		var currVersus = valores.Cube.find(function (e, arr) {
			return e["$"].currency == versus

		});

		var cambio = vBase * currVersus["$"].rate 

		var a = {
			'base': req.body.base,
			'vBase': req.body.vBase,
			'versus': req.body.versus,
			'vVersus': cambio.toFixed(4),
		}
	} else if (req.body.versus == 'EUR'){
		var base = req.body.base
		var vBase = parseFloat(req.body.vBase)
		var vVersus = parseFloat(req.body.vVersus)
		var now = new Date()
		var today = date.format(now, 'YYYY-MM-DD')
		var a = JSON.parse(extraccion)

		var valores = a[0].Cube.find(function (e, arr) {
			return e["$"].time == today
		});

		var currBase = valores.Cube.find(function (e, arr) {
			return e["$"].currency == base

		});
		
		var cambio = vBase * (1 / currBase["$"].rate)

		var a = {
			'base': req.body.base,
			'vBase': req.body.vBase,
			'versus': req.body.versus,
			'vVersus': cambio.toFixed(4),
		}
	}else{

		var base = req.body.base
		var versus = req.body.versus
		var vBase = parseFloat(req.body.vBase)
		var vVersus = parseFloat(req.body.vVersus)
		var now = new Date()
		var today = date.format(now, 'YYYY-MM-DD')
		var a = JSON.parse(extraccion)

		var valores = a[0].Cube.find(function (e, arr) {
			return e["$"].time == today
		});

		var currBase = valores.Cube.find(function (e, arr) {
			return e["$"].currency == base

		});

		var currVersus = valores.Cube.find(function (e, arr) {
			return e["$"].currency == versus

		});
		var cambio = vBase*((1 / currBase["$"].rate) * currVersus["$"].rate)

		var a = {
			'base': req.body.base,
			'vBase': req.body.vBase,
			'versus': req.body.versus,
			'vVersus': cambio.toFixed(4),
		}
	}
	

	console.log(a)
	res.send(a)

	/*if ((typeof req.body.base == 'string' && req.params.base.length == 3) && (typeof req.body.versus == 'string' && req.params.versus.length == 3)) {
		var base = req.body.base.toUpperCase()
		var versus = req.body.versus.toUpperCase()
		var vBase = req.body.vBase
		var vVersus = req.body.vVersus			
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
				"vBase": vBase,
				"vVersus": vVersus
			}
			console.log(o)
			res.send(JSON.stringify(o));

		}
	 } *//*else if(base == 'EUR'){
			

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
	}*/

});

app.get("/latest/:id", async function (req, res) {
 
  if (typeof req.params.id == 'string' && req.params.id.length == 3 ) {

    var now = new Date()
    var today = date.format(now, 'YYYY-MM-DD')
    var a = JSON.parse(extraccion)
	var currency = req.params.id.toUpperCase()
	

    var valores = a[0].Cube.find(function (e, arr) {
      return e["$"].time == today
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