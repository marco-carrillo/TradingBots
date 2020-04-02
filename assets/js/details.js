//*****************************************************/
//  Generate the charts with actual data :  Historical
//*************************************************** */

function generateHsChartData(stock_data) {

    for (var i = 0; i < stock_data.length; i++) {   // data comes from AIX on a daily basis
        var newTime=new Date(stock_data[i].date);   // Creating the new date using last trading date
        chartHsData.push({
            date: newTime,                        // date
            value: stock_data[i].close,         // closing price for stock on that day
        });
    }
}  // last line of generateIDChartData function


//********************************************************************************** */
//  Creates the skeleton for the Historical chart.  Once data is ready, it will be populated
//********************************************************************************** */

function createHsStockChart() {
    chartHs = new AmCharts.AmStockChart();

    // DATASETS //////////////////////////////////////////
    var dataSet = new AmCharts.DataSet();
    dataSet.color = "#0b74eb";    // original #b0de09
    dataSet.fieldMappings = [{
        fromField: "value",
        toField: "value"
    }];
    dataSet.dataProvider = chartHsData;
    dataSet.categoryField = "date";

    chartHs.dataSets = [dataSet];

    // PANELS ///////////////////////////////////////////
    var stockPanel = new AmCharts.StockPanel();
    stockPanel.showCategoryAxis = true;
    stockPanel.title = "Value";
    stockPanel.eraseAll = false;
    stockPanel.addLabel(0, 100, "", "center", 16);

    var graph = new AmCharts.StockGraph();
    graph.valueField = "value";
    graph.bullet = "round";
    graph.bulletColor = "#FFFFFF";
    graph.bulletBorderColor = "#00BBCC";
    graph.bulletBorderAlpha = 1;
    graph.bulletBorderThickness = 2;
    graph.bulletSize = 7;
    graph.lineThickness = 2;
    graph.lineColor = "#00BBCC";
    graph.useDataSetColors = false;
    stockPanel.addStockGraph(graph);

    var stockLegend = new AmCharts.StockLegend();
    stockLegend.valueTextRegular = " ";
    stockLegend.markerType = "none";
    stockPanel.stockLegend = stockLegend;
    stockPanel.drawingIconsEnabled = true;

    chartHs.panels = [stockPanel];


    // OTHER SETTINGS ////////////////////////////////////
    var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
    scrollbarSettings.graph = graph;
    scrollbarSettings.updateOnReleaseOnly = false;
    chartHs.chartScrollbarSettings = scrollbarSettings;

    var cursorSettings = new AmCharts.ChartCursorSettings();
    cursorSettings.valueBalloonsEnabled = true;
    chartHs.chartCursorSettings = cursorSettings;

    var panelsSettings = new AmCharts.PanelsSettings();
    panelsSettings.creditsPosition = "bottom-right";
    panelsSettings.marginRight = 16;
    panelsSettings.marginLeft = 16;
    chartHs.panelsSettings = panelsSettings;


    // PERIOD SELECTOR ///////////////////////////////////
    var periodSelector = new AmCharts.PeriodSelector();
    periodSelector.position = "bottom";
    periodSelector.periods = [{
        period: "DD",
        count: 10,
        label: "10 days"
    }, {
        period: "MM",
        count: 1,
        label: "1 month"
    }, {
        period: "YYYY",
        count: 1,
        label: "1 year"
    }, {
        period: "YTD",
        label: "YTD"
    }, {
        period: "MAX",
        label: "MAX"
    }];
    chartHs.periodSelector = periodSelector;
    chartHs.write('charthist');
}

//*****************************************************/
//  Generate the charts with actual data :  IntraDay
//*************************************************** */

function generateIDChartData(stock_data) {

    var lastTradingDate = new Date(stock_data[0].date);
    lastTradingDate.setHours(0, 0, 0, 0);


    for (var i = 0; i < stock_data.length; i++) {   // data comes from AIX on a one-minute interval
 
        var newTime=new Date(lastTradingDate);   // Creating the new date using last trading date
        var HrMin=stock_data[i].minute.split(":");
        newTime.setHours(parseInt(HrMin[0]),parseInt(HrMin[1]),0,0);
  
        chartData.push({
            date: newTime,                        // date
            value: stock_data[i].average,         // average price during minute
            volume: stock_data[i].volume          // volume during minute
        });
    }
}  // last line of generateIDChartData function


//********************************************************************************** */
//  Creates the skeleton for the Intraday chart.  Once data is ready, it will be populated
//********************************************************************************** */

function createIDStockChart() {
    chart = new AmCharts.AmStockChart();

    // As we have minutely data, we should set minPeriod to "mm"
    var categoryAxesSettings = new AmCharts.CategoryAxesSettings();
    categoryAxesSettings.minPeriod = "mm";
    chart.categoryAxesSettings = categoryAxesSettings;

    // DATASETS //////////////////////////////////////////
    var dataSet = new AmCharts.DataSet();
    dataSet.color = "#0b74eb";   // originally "#b0de09"
    dataSet.fieldMappings = [{
        fromField: "value",
        toField: "value"
    }, {
        fromField: "volume",
        toField: "volume"
    }];
    dataSet.dataProvider = chartData;
    dataSet.categoryField = "date";

    // set data sets to the chart
    chart.dataSets = [dataSet];

    // PANELS ///////////////////////////////////////////
    // first stock panel
    var stockPanel1 = new AmCharts.StockPanel();
    stockPanel1.showCategoryAxis = false;
    stockPanel1.title = "Value";
    stockPanel1.percentHeight = 70;

    // graph of first stock panel
    var graph1 = new AmCharts.StockGraph();
    graph1.valueField = "value";
    graph1.type = "smoothedLine";
    graph1.lineThickness = 2;
    graph1.bullet = "round";
    graph1.bulletBorderColor = "#FFFFFF";
    graph1.bulletBorderAlpha = 1;
    graph1.bulletBorderThickness = 3;
    stockPanel1.addStockGraph(graph1);

    // create stock legend
    var stockLegend1 = new AmCharts.StockLegend();
    stockLegend1.valueTextRegular = " ";
    stockLegend1.markerType = "none";
    stockPanel1.stockLegend = stockLegend1;


    // second stock panel
    var stockPanel2 = new AmCharts.StockPanel();
    stockPanel2.title = "Volume";
    stockPanel2.percentHeight = 30;
    var graph2 = new AmCharts.StockGraph();
    graph2.valueField = "volume";
    graph2.type = "column";
    graph2.cornerRadiusTop = 2;
    graph2.fillAlphas = 1;
    stockPanel2.addStockGraph(graph2);

    // create stock legend
    var stockLegend2 = new AmCharts.StockLegend();
    stockLegend2.valueTextRegular = " ";
    stockLegend2.markerType = "none";
    stockPanel2.stockLegend = stockLegend2;

    // set panels to the chart
    chart.panels = [stockPanel1, stockPanel2];


    // OTHER SETTINGS ////////////////////////////////////
    var scrollbarSettings = new AmCharts.ChartScrollbarSettings();
    scrollbarSettings.graph = graph1;
    scrollbarSettings.usePeriod = "10mm"; // this will improve performance
    scrollbarSettings.updateOnReleaseOnly = false;
    scrollbarSettings.position = "top";
    chart.chartScrollbarSettings = scrollbarSettings;

    var cursorSettings = new AmCharts.ChartCursorSettings();
    cursorSettings.valueBalloonsEnabled = true;
    chart.chartCursorSettings = cursorSettings;


    // PERIOD SELECTOR ///////////////////////////////////
    var periodSelector = new AmCharts.PeriodSelector();
    periodSelector.position = "top";
    periodSelector.dateFormat = "YYYY-MM-DD JJ:NN";
    periodSelector.inputFieldWidth = 150;
    periodSelector.periods = [{
        period: "hh",
        count: 1,
        label: "1 hour"
    }, {
        period: "hh",
        count: 2,
        label: "2 hours"
    }, {
        period: "hh",
        count: 5,
        label: "5 hour"
    }, {
        period: "hh",
        count: 12,
        label: "12 hours"
    }, {
        period: "MAX",
        label: "MAX"
    }];
    chart.periodSelector = periodSelector;

    var panelsSettings = new AmCharts.PanelsSettings();
    panelsSettings.mouseWheelZoomEnabled = true;
    panelsSettings.usePrefixes = true;
    chart.panelsSettings = panelsSettings;


    chart.write('chartdiv');
}

//************************************************************************ */
//  The following function responds to the ajax call and orchestrates
//  the creation of an intrad-day chart for the stock selected
//************************************************************************ */

function showIDchart(idata) {

    //  updating potential trade with the latest stock price.  It will try the latest minute, and then it will go back 
    //  until it get data that is not null

    var i=idata.length-1;
    do {
        latest_stock_price=idata[i].average;
        i--;
    } while (i>=0&&latest_stock_price===null);
    var trade_cost=100*latest_stock_price;

    // If there is valid intraday data then display the information
    if (idata.length>0){
        generateIDChartData(idata);
        createIDStockChart();

        // once it gets data back, then it creates the label for the buttons
        $("#trdl100").text("Long 100 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(100*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trdl200").text("Long 200 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(200*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trdl300").text("Long 300 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(300*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trdl400").text("Long 400 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(400*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trdl500").text("Long 500 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(500*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));

        $("#trds100").text("Short 100 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(100*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trds200").text("Short 200 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(200*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trds300").text("Short 300 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(300*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trds400").text("Short 400 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(400*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));
        $("#trds500").text("Short 500 sh @"+(latest_stock_price).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')+" for $"+(500*latest_stock_price).toFixed(0).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'));

    }
    else {
        $.confirm({
            title: 'No Intraday Data',
            content: 'There is no recorded market activity today.  Either the market has not opened or today is a holiday',
            type: 'red',   
            buttons: {
                         delete: {text: 'Understand', btnClass: 'btn-red',
                         action: function(){}  }
                      }
        });  // Jquery confirm
    }  // if-then-else
}  // end of function showIDChart

//*************************************************************** */
//  Following function handles API error
//*************************************************************** */

function handles_APIerror(data){

    $.confirm({
        title: 'Error',
        content: 'There was an error getting intraday data.  Please try again, or call us back at 1-900-TRD-BOTS',
        type: 'red',   
        buttons: {
                     delete: {text: 'Understand', btnClass: 'btn-red',
                     action: function(){}  }
                  }
    });  // Jquery confirm

}  // end of function handles_APIerror

//************************************************************************ */
//  The following function responds to the ajax call and orchestrates
//  the creation of a historical chart for the stock selected
//************************************************************************ */

function showHschart() {
    var API_response=JSON.parse(localStorage.getItem("API_response"));     // Getting API responses from local storage
    var historical_data=API_response[sindex].chart;                        // data obtained from API response

    if (historical_data.length>0){
        generateHsChartData(historical_data);
        createHsStockChart(); }
    else {
        $.confirm({
            title: 'R001-Internal error',
            content: 'Please try again and if the issue persists, contact us at 1-800-TRD-BOTS and provide us with the code above',
            type: 'red',   
            buttons: {
                         delete: {text: 'Understand', btnClass: 'btn-red',
                         action: function(){}  }
                      }
        });  // Jquery confirm
    }  // if-then-else
}  // end of function showIDChart


//************************************************************************************ */
//  The following function will display a message about trading long
//************************************************************************************ */

function trd_confirmation(){

    var rtype="";
    var rbutton="";
    var msg="Confirmation, traded "+$(this).text();

    if($(this).attr("trddir")==="Long"){
        rtype="green";
        rbutton="btn-green"
    }
    else {
        rtype="purple";
        rbutton="btn-purple";
    }
    
    $.confirm({
        title: 'Trading confirmation',
        content: msg,
        type: rtype,   
        buttons: {
                     delete: {text: 'Got it', btnClass: rbutton,
                     action: function(){}  }
                  }
    });  // Jquery confirm
}

//*********************************************************************************/
//  Following function gets response from the stocks news API call and puts it
//  into MD Bootrstrap for sorting
//*********************************************************************************/

function showNews(response){
 
    localStorage.setItem("news_response",JSON.stringify(response));
    // var response=JSON.parse(localStorage.getItem("news_response"));  

// appends items to table
    for(var i=0;i<response.data.length;i++){
        var newnews=$("<tr>");                                                          // header.  
        var newdate=$("<td>").text(moment(response.data[i].date).format("YYYY-MM-DD")); // date of article
        var newsent=$("<td>").text(response.data[i].sentiment);                         // sentient of news
        var newtitle=$("<td>").text(response.data[i].title);                            // Title of the news
        var newsource=$("<td>").text(response.data[i].source_name);                     // Source of the news
        var newurl=$("<td>").text(response.data[i].news_url);                           // URL for the news
        newnews.append(newdate);
        newnews.append(newsent);
        newnews.append(newtitle);
        newnews.append(newsource);
        newnews.append(newurl);
        $("#article-list").append(newnews);
    }

     // Initialize table -  Required by MDBootstrap
     $('#news-list').dataTable({
        "scrollX": true,
        "scrollY": 300,
        "show": 25,
        "order": [[0,"desc"]],

        columnDefs: [
            {targets: 2,
            render: function (data, type, row, meta)
            {   data = '<a href="'+row[4] + '" target="_blank">'+data+'</a>';
            return data; }}]  


     }); // datatable initialization

}  // End function showNews

//********************* */
// main functionality
//********************* */

$("#back").attr("onClick","window.location.href='getstocks.html'");   // on back, it will load functon getstocks

var chartData = [];        // Initializes chart, required by AMD charts
var chart;                 // Initializes chart, required by AMD charts
var chartHsData = [];      // Initializes chart, required by AMD charts
var chartHs;               // Initializes chart, required by AMD charts

// Setting global variables

var stock_list=[];                                         // global variable, array that contains stock data
var base_url="https://sandbox.iexapis.com/stable/stock/";  // Live data versus sandbox
var api_token="Tsk_c7a9b5b07a7d4570afb668eccf02054b";      // token
var current_stock=localStorage.getItem("");                // stock whose information is being fetched by API
var latest_stock_price=0;                                  // last known stock price returned by API

// getting which stock was selected from local storage, finding its index, showing it in the title
var stock_selected=localStorage.getItem("selectedStock");
var stock_list=JSON.parse(localStorage.getItem("LSstock_list"));
var sindex=stock_list.map(function(e) {return e.name}).indexOf(stock_selected);
var sTickler=stock_list[sindex].tickler;
var sName=stock_list[sindex].name;
$("#det-title").text("Stock details for "+sTickler+" - "+stock_list[sindex].name);  

// Getting intra-day data from IEX API
var APIquery=base_url+sTickler+"/intraday-prices/adx?range=1m&token="+api_token;
$.ajax({url: APIquery,success: showIDchart, error: handles_APIerror});

// while waiting for API response, setting up the 6-month historical-data using API responses previously stored
showHschart();

//  Assigns actions to the trading quantity buttons
$(".trd-button").on("click",trd_confirmation);

//  Fetching articles based on the last week of trading
var News_base_url="https://stocknewsapi.com/api/v1"
var News_stock_ticker="?tickers="+sTickler+"&items=50"
var News_api_token="&token=zgnr45fiudxhs9tdc9thlumkkwril7vqlmoqnbtp"
var News_API_query=News_base_url+News_stock_ticker+News_api_token;
$.ajax({url: News_API_query,success: showNews, error: handles_APIerror});
$("#tabs").on( "tabsactivate", function( event, ui ) {$($.fn.dataTable.tables(true)).DataTable().columns.adjust();} );