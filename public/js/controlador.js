$(document).ready(function () {
    historicoF()
   
    var myLineChart
   
    $.ajax({

        url: "/inicio",
        dataType: "json",
        method: "POST",
        success: function (result) {
            console.log(result);

           var data = ''
           for (var key in result) {
               data = data + '<option value="'+key+'">'+key+'</option>';   
           }

            $("#Curr-Base").html(data)
            $("#Curr-Versus").html(data)
            cambio()

        },
        error: function (error) {
            console.log(error);
        }
    });


    $("#num-versus").change(function () {
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val()
     
        if ($("#Curr-Base").val() == $("#Curr-Versus").val()) {
            $('#num-base').val($('#num-versus').val())
        }else{
            // alert(a)
            $.ajax({

                url: "/latest",
                data: a,
                dataType: "json",
                method: "POST",
                success: function (result) {
                    console.log(result);
                    $('#num-base').val(result.vBase)
                    $('#num-versus').val(result.vVersus)
                    var flag = '<i class="currency-flag currency-flag-' + result.base.toLowerCase() + ' currency-flag-lg text-gray-300"></i>'
                    $('#flag').html(flag)

                },
                error: function (error) {
                    console.log(error);
                }
            });

        }
    })
    $("#num-base").change(function () {
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val()
        if ($("#Curr-Base").val() == $("#Curr-Versus").val()){
            $('#num-versus').val($('#num-base').val())
        }else{
            $.ajax({

                url: "/latest",
                data: a,
                dataType: "json",
                method: "POST",
                success: function (result) {
                    console.log(result);
                    $('#num-base').val(result.vBase)
                    $('#num-versus').val(result.vVersus)
                    var flag = '<i class="currency-flag currency-flag-' + result.base.toLowerCase() + ' currency-flag-lg text-gray-300"></i>'
                    $('#flag').html(flag)

                },
                error: function (error) {
                    console.log(error);
                }
            });

        }
    });    


    $("#Curr-Base").change(function () {
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val()

        $.ajax({

            url: "/latest",
            data: a,
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result);
                $('#num-base').val(result.vBase)
                $('#num-versus').val(result.vVersus)
                var flag = '<i class="currency-flag currency-flag-' + result.base.toLowerCase()+' currency-flag-lg text-gray-300"></i>'
                $('#flag').html(flag)
                historicalF();
                cambio()
                

            },

            error: function (error) {
                console.log(error);
            }
        });

    });



    $("#Curr-Versus").change(function () {
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val()

      //  alert(a);
        $.ajax({

            url: "/latest",
            data: a,
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result);
                $('#num-base').val(result.vBase)
                $('#num-versus').val(result.vVersus)
                var flag = '<i class="currency-flag currency-flag-' + result.versus.toLowerCase() + ' currency-flag-lg text-gray-300"></i>'
                $('#flag-i').html(flag)
                historicalF()
                

            },
            error: function (error) {
                console.log(error);
            }
        });

    });






    function historicalF(){
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val() + '&fecha=' + $('#fecha-historico').val()
        myLineChart.destroy();
        
        $.ajax({

            url: "/historical",
            data: a,
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result);

                var ctx = $("#myAreaChart");

                myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: result.days,
                        datasets: [{
                            label: "Rate",
                            lineTension: 0.3,
                            backgroundColor: "rgba(78, 115, 223, 0.05)",
                            borderColor: "rgba(78, 115, 223, 1)",
                            pointRadius: 3,
                            pointBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointBorderColor: "rgba(78, 115, 223, 1)",
                            pointHoverRadius: 3,
                            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                            pointHitRadius: 10,
                            pointBorderWidth: 2,
                            data: result.valor,
                        }, {
                            label: "Date",
                            lineTension: 0.3,
                            backgroundColor: "rgba(78, 115, 223, 0.05)",
                            borderColor: "rgba(78, 115, 223, 1)",
                            pointRadius: 3,
                            pointBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointBorderColor: "rgba(78, 115, 223, 1)",
                            pointHoverRadius: 3,
                            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                            pointHitRadius: 10,
                            pointBorderWidth: 2,
                            data: result.fechas,
                        }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                left: 10,
                                right: 25,
                                top: 25,
                                bottom: 0
                            }
                        },
                        scales: {
                            xAxes: [{
                                time: {
                                    unit: 'date'
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                ticks: {
                                    maxTicksLimit: 7
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    maxTicksLimit: 5,
                                    padding: 10,
                                    // Include a dollar sign in the ticks
                                    callback: function (value, index, values) {
                                        return '' + value.toFixed(4);
                                    }
                                },
                                gridLines: {
                                    color: "rgb(234, 236, 244)",
                                    zeroLineColor: "rgb(234, 236, 244)",
                                    drawBorder: false,
                                    borderDash: [2],
                                    zeroLineBorderDash: [2]
                                }
                            }],
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            backgroundColor: "rgb(255,255,255)",
                            bodyFontColor: "#858796",
                            titleMarginBottom: 10,
                            titleFontColor: '#6e707e',
                            titleFontSize: 14,
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: false,
                            intersect: false,
                            mode: 'index',
                            caretPadding: 10,
                            callbacks: {
                                label: function (tooltipItem, chart) {
                                    var re = []

                                    chart.datasets.forEach(function (e, arr) {
                                        if (e.label == 'Rate') {
                                            re.push(e.label + ': ' + tooltipItem.yLabel.toFixed(4))
                                        } else if (e.label == 'Date') {
                                            re.push(e.label + ': ' + e.data[tooltipItem.index])
                                        }

                                    })
                                    return re

                                }
                            }
                        }
                    }
                });
           },
            error: function (error) {
                console.log(error);
            }
        });



    }




    function removeData(chart) {
        chart.data.labels.pop();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.pop();
        });
        chart.update();
    }
    function addData(chart, label, data) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }

    Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
    Chart.defaults.global.defaultFontColor = '#858796';

    function historicoF() {
        $.ajax({

            url: "/historical",
            data: 'fecha=' + $('#fecha-historico').val(),
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result);

                var ctx = document.getElementById("myAreaChart");
                myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: result.days,
                        datasets: [{
                            label: "Rate",
                            lineTension: 0.3,
                            backgroundColor: "rgba(78, 115, 223, 0.05)",
                            borderColor: "rgba(78, 115, 223, 1)",
                            pointRadius: 3,
                            pointBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointBorderColor: "rgba(78, 115, 223, 1)",
                            pointHoverRadius: 3,
                            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                            pointHitRadius: 10,
                            pointBorderWidth: 2,
                            data: result.valor,
                        }, {
                            label: "Date",
                            lineTension: 0.3,
                            backgroundColor: "rgba(78, 115, 223, 0.05)",
                            borderColor: "rgba(78, 115, 223, 1)",
                            pointRadius: 3,
                            pointBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointBorderColor: "rgba(78, 115, 223, 1)",
                            pointHoverRadius: 3,
                            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                            pointHitRadius: 10,
                            pointBorderWidth: 2,
                            data: result.fechas,
                        }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                left: 10,
                                right: 25,
                                top: 25,
                                bottom: 0
                            }
                        },
                        scales: {
                            xAxes: [{
                                time: {
                                    unit: 'date'
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                ticks: {
                                    maxTicksLimit: 7
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    maxTicksLimit: 5,
                                    padding: 10,
                                    callback: function (value, index, values) {
                                        return '' + value.toFixed(4);
                                    }
                                },
                                gridLines: {
                                    color: "rgb(234, 236, 244)",
                                    zeroLineColor: "rgb(234, 236, 244)",
                                    drawBorder: false,
                                    borderDash: [2],
                                    zeroLineBorderDash: [2]
                                }
                            }],
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            backgroundColor: "rgb(255,255,255)",
                            bodyFontColor: "#858796",
                            titleMarginBottom: 10,
                            titleFontColor: '#6e707e',
                            titleFontSize: 14,
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: false,
                            intersect: false,
                            mode: 'index',
                            caretPadding: 10,
                            callbacks: {
                                label: function (tooltipItem, chart) {
                                    var re = []

                                    chart.datasets.forEach(function (e, arr) {
                                        if (e.label == 'Rate') {
                                            re.push(e.label + ': ' + tooltipItem.yLabel.toFixed(4))
                                        } else if (e.label == 'Date') {
                                            re.push(e.label + ': ' + e.data[tooltipItem.index])
                                        }

                                    })
                                    return re
                                }
                            }
                        }
                    }
                });
            },
            error: function (error) {
                console.log(error);
            }
        });

    }

    $("#fecha-historico").change(function () {
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val() + '&fecha=' + $('#fecha-historico').val()

        myLineChart.destroy();
        $.ajax({

            url: "/historical",
            data: a,
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result);

                var ctx = $("#myAreaChart");

                myLineChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: result.days,
                        datasets: [{
                            label: "Rate",
                            lineTension: 0.3,
                            backgroundColor: "rgba(78, 115, 223, 0.05)",
                            borderColor: "rgba(78, 115, 223, 1)",
                            pointRadius: 3,
                            pointBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointBorderColor: "rgba(78, 115, 223, 1)",
                            pointHoverRadius: 3,
                            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                            pointHitRadius: 10,
                            pointBorderWidth: 2,
                            data: result.valor,
                        }, {
                            label: "Date",
                            lineTension: 0.3,
                            backgroundColor: "rgba(78, 115, 223, 0.05)",
                            borderColor: "rgba(78, 115, 223, 1)",
                            pointRadius: 3,
                            pointBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointBorderColor: "rgba(78, 115, 223, 1)",
                            pointHoverRadius: 3,
                            pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                            pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                            pointHitRadius: 10,
                            pointBorderWidth: 2,
                            data: result.fechas,
                        }],
                    },
                    options: {
                        maintainAspectRatio: false,
                        layout: {
                            padding: {
                                left: 10,
                                right: 25,
                                top: 25,
                                bottom: 0
                            }
                        },
                        scales: {
                            xAxes: [{
                                time: {
                                    unit: 'date'
                                },
                                gridLines: {
                                    display: false,
                                    drawBorder: false
                                },
                                ticks: {
                                    maxTicksLimit: 7
                                }
                            }],
                            yAxes: [{
                                ticks: {
                                    maxTicksLimit: 5,
                                    padding: 10,
                                    // Include a dollar sign in the ticks
                                    callback: function (value, index, values) {
                                        return '' + value.toFixed(4);
                                    }
                                },
                                gridLines: {
                                    color: "rgb(234, 236, 244)",
                                    zeroLineColor: "rgb(234, 236, 244)",
                                    drawBorder: false,
                                    borderDash: [2],
                                    zeroLineBorderDash: [2]
                                }
                            }],
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            backgroundColor: "rgb(255,255,255)",
                            bodyFontColor: "#858796",
                            titleMarginBottom: 10,
                            titleFontColor: '#6e707e',
                            titleFontSize: 14,
                            borderColor: '#dddfeb',
                            borderWidth: 1,
                            xPadding: 15,
                            yPadding: 15,
                            displayColors: false,
                            intersect: false,
                            mode: 'index',
                            caretPadding: 10,
                            callbacks: {
                                label: function (tooltipItem, chart) {
                                    var re = []

                                    chart.datasets.forEach(function (e, arr) {
                                        if (e.label == 'Rate') {
                                            re.push(e.label + ': ' + tooltipItem.yLabel.toFixed(4))
                                        } else if (e.label == 'Date') {
                                            re.push(e.label + ': ' + e.data[tooltipItem.index])
                                        }

                                    })
                                    return re

                                }
                            }
                        }
                    }
                });


            },
            error: function (error) {
                console.log(error);
            }
        });

    });


    function cambio(){
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val()
        //alert(a)
        $.ajax({

            url: "/cambio",
            data: a,
            dataType: "json",
            method: "POST",
            success: function (result) {
                console.log(result.rates);
                console.log(result)
                var lista = ''
                 for(var key in result.rates){
                     console.log(key)

                     lista = lista + '<li class="nav-item active">' + 
                         '<a class="nav-link" style="padding-top: 0rem;padding-bottom: 0rem">' + 
                         '<i class="currency-flag currency-flag-' + key.toLowerCase() + ' currency-flag-sm text-gray-300"></i>'+
                         '<span >' +' '+ key + ' ' + result.rates[key] + '</span>' +
                     '</a>'+
                     ' </li>'
                    
                     
                     
                 }
                 //console.log(lista)
                $('#lista-cambios').html(lista)
                $('#Nombre-moneda').html('Tipo de cambio ' + result.base + '<i style="margin-left: 0.6rem" class="currency-flag currency-flag-' + result.base.toLowerCase() + ' currency-flag-sm text-gray-300"></i>')
                $('#Fecha-moneda').html('para hoy ' + result.date)
                
            },
            error: function (error) {
                console.log(error);
            }
        });

    }


});