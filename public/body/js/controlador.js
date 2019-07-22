$(document).ready(function () {
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
    });    


    $("#Curr-Base").change(function () {
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val()

        alert(a);
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

            },
            error: function (error) {
                console.log(error);
            }
        });

    });



    $("#Curr-Versus").change(function () {
        var a = 'base=' + $("#Curr-Base").val() + '&versus=' + $("#Curr-Versus").val() + '&vBase=' + $('#num-base').val() + '&vVersus=' + $('#num-versus').val()

        alert(a);
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

            },
            error: function (error) {
                console.log(error);
            }
        });

    });
});