//  Variables that will change
stock_symbol="AAPL";


// variables pretty stable
apiKey="pk_b38152a336f24abcb3cc369bf985f4d3 "
base_url="https://cloud.iexapis.com/";
version="v1";
endpoint_path="/stock/"+stock_symbol;
query_string="?token="+apiKey+"&period=annual";

// asking for Apple stock
apiQuery="https://cloud.iexapis.com/v1/stock/"+stock_symbol+"/financials/2?token="+apiKey+"period=annual"

// asking for apple technical indicator

var endpoint_path="/indicator/";
var range="?range=5d"
var token="&token"

apiQuery=base_url+version+endpoint_path+endpoint_path+stock_symbol+range;

apiQuery="https://cloud.iexapis.com/stable/stock/COF/indicator/adx?range=1m&token="+apiKey;

console.log(apiQuery);

