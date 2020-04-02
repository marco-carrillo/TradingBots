
//****************************************************************************/
//   Function adds the strategy into local storage.  data of all
//   strategies is stored in an array of objects, and then stored.
//****************************************************************************/

function addstrat(){

    //  Checks that there is a total of 100% allocated to the entire strategy
    var total_pctg =0;
    var total_adx=0;
    var total_rsi=0;
    var total_srsi=0;
    var total_mom=0;
    
    if($("#adx-ok").is(":checked"))  {total_adx=parseInt($("#adx-slider").val())}
    if($("#rsi-ok").is(":checked"))  {total_rsi=parseInt($("#rsi-slider").val())}
    if($("#srsi-ok").is(":checked")) {total_srsi=parseInt($("#srsi-slider").val())}
    if($("#mom-ok").is(":checked"))  {total_mom=parseInt($("#mom-slider").val())}
    total_pctg=total_adx+total_rsi+total_srsi+total_mom;


    // Getting the information from the form
    var strat_name=$("#strat-name").val();
    var strat_desc=$("#strat-desc").val();

    // Validates the data and adds to localstorage
    if(total_pctg===100&&strat_name.length>0&&strat_name.length<=10&&strat_desc.length>0&&strat_desc.length<=50){
        // all validations passed, then create the new variable
        var new_strategy={  name: strat_name ,
                            desc: strat_desc,
                            adx_wgth: total_adx,
                            rsi_wgth: total_rsi,
                            srsi_wgth: total_srsi,
                            mom_wgth: total_mom,
                            date_created:  moment().format('L'),
                            date_edited:  moment().format('L'),
                            date_used:  moment().format('L')  }

        // Geting information from local storage
        var all_strategies=JSON.parse(localStorage.getItem("strategies"));
        if(all_strategies===null){var all_strategies=[]}
        all_strategies.push(new_strategy);
        localStorage.setItem("strategies",JSON.stringify(all_strategies));

        $.confirm({
            title: 'Success!!!!!',
            content: 'Your strategy '+strat_name+' can be used right away!!!!!  You can continue adding more, or push the back button to go back' ,
            type: 'green',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Success',
                    btnClass: 'btn-success',
                    action: function(){
                    // Resetting values to default
                    $("#strat-name").val("");
                    $("#strat-desc").val("");
                    $("#adx-ok").prop("checked",true);
                    $("#rsi-ok").prop("checked",true);
                    $("#srsi-ok").prop("checked",true);
                    $("#mom-ok").prop("checked",true);
                    document.getElementById("adx-slider").value=25;
                    document.getElementById("rsi-slider").value=25;
                    document.getElementById("srsi-slider").value=25;
                    document.getElementById("mom-slider").value=25;
                    $("#adx-pctg").html("25%");
                    $("#rsi-pctg").html("25%");
                    $("#srsi-pctg").html("25%");
                    $("#mom-pctg").html("25%");
                    $("#strat-name").focus();
                    }
                }
             }
            });  // jquery confirm

    } else{

        // setting the new strategy name
        var error_message="";
        if(total_pctg!==100){error_message="Total weights should add 100%, not "+total_pctg+"%.  "};
        if(strat_name.length===0||strat_name.length>10){error_message=error_message+"Strategy name needs to be 1-10 characters, not "+strat_name.length+".  "};
        if(strat_desc.length===0||strat_desc.length>50){error_message=error_message+"Strategy description needs to be 1-10 characters, not "+strat_desc.length+"."};

        // delivering the message, going back to the page, doesn't change anything

        $.confirm({
            title: 'Encountered an error!',
            content: error_message,
            type: 'red',
            typeAnimated: true,
            buttons: {
                tryAgain: {
                    text: 'Start over',
                    btnClass: 'btn-red',
                    action: function(){
                    // Resetting values to default
                    $("#strat-name").val("");
                    $("#strat-desc").val("");
                    $("#adx-ok").prop("checked",true);
                    $("#rsi-ok").prop("checked",true);
                    $("#srsi-ok").prop("checked",true);
                    $("#mom-ok").prop("checked",true);
                    document.getElementById("adx-slider").value=25;
                    document.getElementById("rsi-slider").value=25;
                    document.getElementById("srsi-slider").value=25;
                    document.getElementById("mom-slider").value=25;
                    $("#adx-pctg").html("25%");
                    $("#rsi-pctg").html("25%");
                    $("#srsi-pctg").html("25%");
                    $("#mom-pctg").html("25%");
                    $("#strat-name").focus();
                    }
                }
             }
            });  // jquery confirm
        //  Returns without doing anything
    }  // end of if-then-else
}  // End of function addstrat


// Assigning click events to all buttons
$("#back").attr("onclick","window.location.href='trading-main.html'");

// Read value of slider on page load and set it to change whenever the slider changes of value for adx
$("#adx-pctg").html($("#adx-slider").val()+"%");
$("#adx-slider").change(function(){$("#adx-pctg").html($(this).val()+"%")});

// Read value of slider on page load and set it to change whenever the slider changes of value for rsi
$("#rsi-pctg").html($("#rsi-slider").val()+"%");
$("#rsi-slider").change(function(){$("#rsi-pctg").html($(this).val()+"%")});

// Read value of slider on page load and set it to change whenever the slider changes of value for stochastic rsi
$("#srsi-pctg").html($("#srsi-slider").val()+"%");
$("#srsi-slider").change(function(){$("#srsi-pctg").html($(this).val()+"%")});

// Read value of slider on page load and set it to change whenever the slider changes of value for momentum
$("#mom-pctg").html($("#mom-slider").val()+"%");
$("#mom-slider").change(function(){$("#mom-pctg").html($(this).val()+"%")});

//  Assign the function to add when the add button is clicked
$("#add-stg").on("click",addstrat);

// focuses on the first field
$("#strat-name").focus();