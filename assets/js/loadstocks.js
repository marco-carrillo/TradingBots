
//***********************************************************************************************/
//  When user selects a row, following function enables/disables buttons, and then it writes     /
//  selected row to local storage to understand which stock was selected                         /
//***********************************************************************************************/

function stock_clicked(){
  var slected = $('#TradingStocksList').find('.selected');  // Which row was selected?
  if(slected.length===0){  // This means, the user de-selected an option, disabling buttons

      $("#zoom-in-stock").attr("disabled",true);
      $("#zoom-in-stock-fnt").attr("class","fas fa-search")
      return;   // Does nothing else
  };  

    // enables buttons, makes them bigger
    $("#zoom-in-stock").attr("disabled",false);
    $("#zoom-in-stock-fnt").attr("class","fas fa-2x fa-search")

    // saves name of selected strategy to local storage
    localStorage.setItem("selectedStock",slected[0].cells[1].textContent);
  }
 

//**********************************************************************************/
//  The following function ranks the stocks and presents the results to the user   /
//**********************************************************************************/

function process_results(){

    // Retrieves the weightings from the strategy selected by the user
    var strat_selected=localStorage.getItem("selectedStrategy");
    var strategies=JSON.parse(localStorage.getItem("strategies"));
    var found_strategy=false;    // Boolean to track whether the strategy selected was found
    var stratx=0;                // Index for the strategy selected
    var results=[];              // Contains stocks to be displayed to user 
    var results_alt=[];          // Potential stocks to be displayed to user

    for(var i=0;i<strategies.length;i++){

       if(strategies[i].name===strat_selected){
           found_strategy=true;
           stratx=i;
       }
    }
    
     // for each stock in list, it will calculate two things:  1) a normalized 0-100 score for each one of the indexes,
     // 2) a composite weighted (based on user input) of the stock.  If any one calculated technical indicator is 0m that
     // means that we couldn't get underlying financial data and therefore the normalized score is 0
     stock_list=JSON.parse(localStorage.getItem("LSstock_list"));

     for(var i=0;i<stock_list.length;i++){

          //  reading the information
          var rsi_ind=stock_list[i].rsi;
          var mom_ind=stock_list[i].mom;

          // scoring adx index.  It is already normalized so won't be changed
          stock_list[i].adxx=stock_list[i].adx;

          // scoring the rsi index.  
          if(rsi_ind>=70){stock_list[i].rsix=rsi_ind}
          else if(rsi_ind>=50){stock_list[i].rsix=rsi_ind-50}
          else if(rsi_ind>=30){stock_list[i].rsix=50-rsi_ind}
          else (stock_list[i].rsix=100-rsi_ind);

          // scoring the srsi index (already normalized from 0 to 1)
          stock_list[i].srsix=100*stock_list[i].srsi;

          // scoring the momentum indicator

          if(mom_ind>-0.10&&mom_ind<0.10){stock_list[i].momx=100}
          else if(mom_ind>-0.20&&mom_ind<0.20){stock_list[i].momx=80}
          else if(mom_ind>-0.50&&mom_ind<0.50){stock_list[i].momx=60}
          else if(mom_ind>-1&&mom_ind<1){stock_list[i].momx=50}
          else if(mom_ind>-2&&mom_ind<2){stock_list[i].momx=40}
          else if(mom_ind>-3&&mom_ind<3){stock_list[i].momx=30}
          else if(mom_ind>-4&&mom_ind<4){stock_list[i].momx=20}
          else if(mom_ind>-5&&mom_ind<5){stock_list[i].momx=10}
          else {stock_list[i].momx=0};

          // calculates the overall score by retrieving 

          stock_list[i].comp=  Math.round(strategies[stratx].adx_wgth)*stock_list[i].adxx +       // normalized adx * weight of ADX
                               Math.round(strategies[stratx].rsi_wgth)*stock_list[i].rsix +       // normalized rsi * weight of rsi
                               Math.round(strategies[stratx].srsi_wgth)*stock_list[i].srsix +     // normalized srsi * weight of srsi
                               Math.round(strategies[stratx].mom_wgth)*stock_list[i].momx         // normalized mom * weight of mom

          stock_list[i].comp=stock_list[i].comp/100;                   // weights are in 1-100 numbers.  Need to convert to percentages
          if(stock_list[i].comp>70){results_alt.push(stock_list[i])}   //  If > 70 composite, adds to list
     }

     // Now that all stocks have been evaluated, it will save the results to local storage
     localStorage.setItem("LSstock_list",JSON.stringify(stock_list));

     //  Sorting stocks in descending order
     results=stock_list.sort(function(a,b){return b.comp-a.comp});

     // making sure the progress bar used for API connection is not visible
     $("#progress-bar-cont").hide();

     // Loading the results into the page
     $("#trading-list").empty()
     for(var i=0;i<results.length;i++){
          var newstock=$("<tr>");                                         // header.  
          var newchkbox=$("<td>");                                        // empty, please leave it for the checkbox
          var newname=$("<td>").text(results[i].name);                    // stock name
          var newsector=$("<td>").text(results[i].sector);                // stock sector
          var newadx=$("<td>").text(results[i].adx.toFixed(0));                      // ADX technical indicator
          var newrsi=$("<td>").text(results[i].rsi.toFixed(0));                      // RSI technical indicator
          var newsrsi=$("<td>").text(results[i].srsi.toFixed(2));                    // SRSI technical indicator
          var newmom=$("<td>").text(results[i].mom.toFixed(2));                      // MOM technical indicator
          var newcomp=$("<td>").text(results[i].comp.toFixed(1));                    // Composite result
          newstock.append(newchkbox);
          newstock.append(newname);
          newstock.append(newsector);
          newstock.append(newadx);
          newstock.append(newrsi);
          newstock.append(newsrsi);
          newstock.append(newmom);
          newstock.append(newcomp);
          $("#trading-list").append(newstock);
     }  // end adding stocks to MD datatable

     // Initialize table
            $('#TradingStocksList').dataTable({
            "scrollX": true,
            "scrollY": 300,
            columnDefs: [{orderable: false, className: 'select-checkbox',targets: 0 }],
                select: { style: 'os', selector: 'td:first-child'}
            });
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
            $(document).on("click",".select-checkbox",stock_clicked);                         // selects stock

}  // end of function process results


//******************************************************************** */
//  This function will look if the stock list exists in local storage,
//  if it does, it does nothing and exits.  If it does not exists
//  it creates the list.  This is the list of stocks that we will
//  monitor each time user wants trading tips.  This list can be
//  expanded with nothing else needed to be done to any of the
//  program functionality.
//******************************************************************** */

function getStocks(){
        var temp_stock_list = JSON.parse(localStorage.getItem("LSstock_list"));
        if(temp_stock_list!==null){
            stock_list=temp_stock_list;   // global variable updated
            return;}

        // if list does not exists, it creates one.  Starts adding the S&P500


        stock_list.push({tickler:'MMM',name:'3M Company',sector:'Industrials',subindustry:'Industrial Conglomerates',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'AXP',name:'American Express Co',sector:'Financials',subindustry:'Consumer Finance',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'AAPL',name:'Apple Inc.',sector:'Information Technology',subindustry:'Technology Hardware, Storage & Peripherals',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'BA',name:'Boeing Company',sector:'Industrials',subindustry:'Aerospace & Defense',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'CAT',name:'Caterpillar Inc.',sector:'Industrials',subindustry:'Construction Machinery & Heavy Trucks',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'CVX',name:'Chevron Corp.',sector:'Energy',subindustry:'Integrated Oil & Gas',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'CSCO',name:'Cisco Systems',sector:'Information Technology',subindustry:'Communications Equipment',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'KO',name:'Coca-Cola Company',sector:'Consumer Staples',subindustry:'Soft Drinks',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'DIS',name:'The Walt Disney Company',sector:'Communication Services',subindustry:'Movies & Entertainment',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'DOW',name:'Dow Inc.',sector:'Materials',subindustry:'Commodity Chemicals',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'XOM',name:'Exxon Mobil Corp.',sector:'Energy',subindustry:'Integrated Oil & Gas',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'GS',name:'Goldman Sachs Group',sector:'Financials',subindustry:'Investment Banking & Brokerage',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'HD',name:'Home Depot',sector:'Consumer Discretionary',subindustry:'Home Improvement Retail',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'IBM',name:'International Business Machines',sector:'Information Technology',subindustry:'IT Consulting & Other Services',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'INTC',name:'Intel Corp.',sector:'Information Technology',subindustry:'Semiconductors',dowj: true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'JNJ',name:'Johnson & Johnson',sector:'Health Care',subindustry:'Pharmaceuticals',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'JPM',name:'JPMorgan Chase & Co.',sector:'Financials',subindustry:'Diversified Banks',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'MCD',name:"McDonald's Corp.",sector:'Consumer Discretionary',subindustry:'Restaurants',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'MRK',name:'Merck & Co.',sector:'Health Care',subindustry:'Pharmaceuticals',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'MSFT',name:'Microsoft Corp.',sector:'Information Technology',subindustry:'Systems Software',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'NKE',name:'Nike',sector:'Consumer Discretionary',subindustry:'Apparel, Accessories & Luxury Goods',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'PFE',name:'Pfizer Inc.',sector:'Health Care',subindustry:'Pharmaceuticals',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'PG',name:'Procter & Gamble',sector:'Consumer Staples',subindustry:'Personal Products',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'TRV',name:'The Travelers Companies Inc.',sector:'Financials',subindustry:'Property & Casualty Insurance',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'UTX',name:'United Technologies',sector:'Industrials',subindustry:'Aerospace & Defense',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'UNH',name:'United Health Group Inc.',sector:'Health Care',subindustry:'Managed Health Care',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'VZ',name:'Verizon Communications',sector:'Communication Services',subindustry:'Integrated Telecommunication Services',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'V',name:'Visa Inc.',sector:'Information Technology',subindustry:'Data Processing & Outsourced Services',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'WMT',name:'Walmart',sector:'Consumer Staples',subindustry:'Hypermarkets & Super Centers',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
        stock_list.push({tickler:'WBA',name:'Walgreens Boots Alliance',sector:'Consumer Staples',subindustry:'Drug Retail',dowj:true,sp500: true,nasdaq: false,adx:0,rsi:0,srsi:0,mom:0,adxx:0,rsix:0,srsix:0,momx:0,comp:0});
                       
        localStorage.setItem("LSstock_list",JSON.stringify(stock_list));

        // for each of the stock list, will create an empty array of objects that will store the responses obtained from the API
        // and will store it to local storage

        var API_response=[];
        for (var i=0;i<stock_list.length;i++){
            API_response.push({indicator:[],chart: []});
        }

        localStorage.setItem("API_response",JSON.stringify(API_response));

}  // end of function getStocks


//***************************************************************************************************/
// This function handles an error response from the ajax call.  Basically, it ignores the issue     /
// and lets the application deal with it later by evaluating the quality of its data set.           /
// it keeps making the subsequent call to another ajax call                                         /
//**************************************************************************************************/


function handles_APIerror(finrsp){

  // Getting data from local storage for use during the ajax call
  var current_stock=parseInt(localStorage.getItem("current_stock"));
  var tech_indicator=parseInt(localStorage.getItem("tech_indicator"));
  var nbr_stocks=parseInt(localStorage.getItem("nbr_stocks"));

  //  Gets data from API and saves it to memory
  if(tech_indicator===1){stock_list[current_stock].adx=0;}
  else if (tech_indicator===2){stock_list[current_stock].rsi=0;}
  else if (tech_indicator===3){stock_list[current_stock].srsi=0;}
  else if (tech_indicator===4){stock_list[current_stock].mom=0; }

  //  checks whether this response is the last call (tech_indicator=4 and it is the last stock)
  //  if so, saves the information to local storage

  if(tech_indicator===4&&current_stock>=nbr_stocks-1){ 
      localStorage.setItem("LSstock_list",JSON.stringify(stock_list));              // saving to local storage
      $("#api-call-progress").text("");                                             // Cleaning progress bar text
      localStorage.setItem("last_download",JSON.stringify(moment().format("L")));   //  Recording last download was today
      process_results();                                                            //  Process-display data
      return;
};

  // if not the end of the list, then keeps processing

if(tech_indicator===1){
         tech_indicator++;   // increases the tech indicator to keep track of which one is the current one
         APIquery=base_url+stock_list[current_stock].tickler+"/indicator/rsi?range=6m&token="+api_token;}
else if (tech_indicator===2){
        tech_indicator++;   // increases the tech indicator to keep track of which one is the current one
        APIquery=base_url+stock_list[current_stock].tickler+"/indicator/stochrsi?range=6m&token="+api_token;}
else if (tech_indicator===3){
        tech_indicator++;   // increases the tech indicator to keep track of which one is the current one
        APIquery=base_url+stock_list[current_stock].tickler+"/indicator/mom?range=6m&token="+api_token;}
else if (tech_indicator===4){
        tech_indicator=1;   // increases the tech indicator to keep track of which one is the current one
        current_stock++;    // Changes stock
        APIquery=base_url+stock_list[current_stock].tickler+"/indicator/adx?range=1m&token="+api_token;}

  // saves the changes to local storage for use for the ajax call back function that will be made next
  localStorage.setItem("current_stock",current_stock.toString());
  localStorage.setItem("tech_indicator",tech_indicator.toString());
          
  // Now that everything has been set, calls another ajax function
  $.ajax({url: APIquery,success: process_APIdata, error: handles_APIerror});

  //  Updating the progress bar
  var pct_comp=Math.round(100*current_stock/nbr_stocks);
  $("#api-call-progress").attr("style","width: "+pct_comp+"%");
  $("#api-call-progress").attr("aria-valuenow",pct_comp);
  $("#api-call-progress").text(stock_list[current_stock].tickler+" | "+pct_comp+"%");

}  // ends function handles_APIerror


//**********************************************************************************************/
// This function handles the response from the ajax call, and makes another asynchronous call   /
// it calls for this same function to handle the ajax call back, if successful                  /
//**********************************************************************************************/

function process_APIdata(finrsp){

  // Getting data from local storage for use during the ajax call
  var current_stock=parseInt(localStorage.getItem("current_stock"));
  var tech_indicator=parseInt(localStorage.getItem("tech_indicator"));
  var nbr_stocks=parseInt(localStorage.getItem("nbr_stocks"));

    //  checks there is a response (length of finrsp at least 1).  If no valid response, it returns,
    //  if there is valid response, then stock data right indicator is updated

    if(finrsp.indicator.length>=1){ rsplng=finrsp.indicator[0].length;}
    else {return}               

    if(tech_indicator===1){stock_list[current_stock].adx=finrsp.indicator[0][rsplng-1];}
    else if (tech_indicator===2){stock_list[current_stock].rsi=finrsp.indicator[0][rsplng-1];}
    else if (tech_indicator===3){stock_list[current_stock].srsi=finrsp.indicator[0][rsplng-1];}
    else if (tech_indicator===4){stock_list[current_stock].mom=finrsp.indicator[0][rsplng-1]; }

    // checking whether this is indicator #4, if so, saves the response to local storage
    if (tech_indicator===4){
       API_response=JSON.parse(localStorage.getItem("API_response"));                //  Gets API responses data
       API_response[current_stock]=finrsp;                                           //  updates the API response matrix
       localStorage.setItem("API_response",JSON.stringify(API_response));            //  saves the API reponse matrix
    }

    //  checks whether this response is the last call (tech_indicator=4 and it is the last stock)
    //  if so, saves the information to local storage.
    

    if(tech_indicator===4&&current_stock>=nbr_stocks-1){ 
        localStorage.setItem("LSstock_list",JSON.stringify(stock_list));              // saving to local storage
        $("#api-call-progress").text("");                                             // Cleaning progress bar text
        localStorage.setItem("last_download",JSON.stringify(moment().format("L")));   //  Recording last download was today
        process_results();                                                            //  Process-display data
        return;
    };

    // if not the end of the list, then keeps processing
  
    if(tech_indicator===1){
      tech_indicator++;   // increases the tech indicator to keep track of which one is the current one
      APIquery=base_url+stock_list[current_stock].tickler+"/indicator/rsi?range=6m&token="+api_token;}
else if (tech_indicator===2){
     tech_indicator++;   // increases the tech indicator to keep track of which one is the current one
     APIquery=base_url+stock_list[current_stock].tickler+"/indicator/stochrsi?range=6m&token="+api_token;}
else if (tech_indicator===3){
     tech_indicator++;   // increases the tech indicator to keep track of which one is the current one
     APIquery=base_url+stock_list[current_stock].tickler+"/indicator/mom?range=6m&token="+api_token;}
else if (tech_indicator===4){
     tech_indicator=1;   // increases the tech indicator to keep track of which one is the current one
     current_stock++;    // Changes stock
     APIquery=base_url+stock_list[current_stock].tickler+"/indicator/adx?range=1m&token="+api_token;}

     // saves the changes to local storage for use for the ajax call back function that will be made next
     localStorage.setItem("current_stock",current_stock.toString());
     localStorage.setItem("tech_indicator",tech_indicator.toString());

    // Now that everything has been set, calls another ajax function
    $.ajax({url: APIquery,success: process_APIdata, error: handles_APIerror});

    //  Updating the progress bar
    var pct_comp=Math.round(100*current_stock/nbr_stocks);
    $("#api-call-progress").attr("style","width: "+pct_comp+"%");
    $("#api-call-progress").attr("aria-valuenow",pct_comp);
    $("#api-call-progress").text(stock_list[current_stock].tickler+" | "+pct_comp+"%");


}  // ends function process_APIdata


//***************************************************************** */
// Main program functionality 
//***************************************************************** */

var stock_list=[];             // global variable, array that contains stock data
var API_response=[];           // global variable, array that continas response from API
var base_url="https://sandbox.iexapis.com/stable/stock/";  // Live data versus sandbox
var api_token="Tsk_c7a9b5b07a7d4570afb668eccf02054b";      // token
var APIquery="";
getStocks();                   // loading the stocks that will be analyzed

var nbr_stocks=stock_list.length;  
var tech_indicator=1;          // which indicator is being retrieved
var current_stock=0;           // which stock is being called for
var rsplng=0;                  // length of the responding variable

// current_stock=500;
localStorage.setItem("current_stock",current_stock.toString());
localStorage.setItem("tech_indicator",tech_indicator.toString());
localStorage.setItem("nbr_stocks",nbr_stocks.toString());

// Gets when the last call was made.  If today, then doesn't call the API anymore.  If different from today, then it does
// makes first ajax call.  Once the first API returns results, the callback function will make
// another ajac call, and so forth until all stocks are covered.  The last ajax call, will then
// call another function that will score the results and sort them

var last_download=JSON.parse(localStorage.getItem("last_download"));

if(last_download!==moment().format("L")){
  $("#progress-bar-cont").show();  // Enables display of the progress bar
  APIquery=base_url+stock_list[current_stock].tickler+"/indicator/adx?range=1m&token="+api_token;  // Preparing first query
  $.ajax({url: APIquery,success: process_APIdata, error: handles_APIerror});}
else {process_results()}

// assign properties to buttons and other objects in page 

$("#back").attr("onclick","window.location.href='trading-main.html'");            // On click to "back button" goes back to trading main
// $(document).on("click",".select-checkbox",stock_clicked);                         // selects stock
$("#zoom-in-stock").attr("onclick","window.location.href='details.html'");   // provides a closer look at the stock
