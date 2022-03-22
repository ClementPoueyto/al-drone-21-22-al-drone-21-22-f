const yargs = require('yargs');

module.exports = { showHelp: showHelp, respond: respond };
const usage = "\nUsage: suivit <Order_id>";

function showHelp() {
  console.log(usage);
  console.log('\nOptions:\r');
  console.log('--o\t--order_id\t      Id of order\t\t\t\t\t\t[string]\r');
  console.log(
    '\t--version\t      ' +
      'Show version number.' +
      '\t\t\t\t\t' +
      '[boolean]\r',
  );
  console.log(
    '\t--help\t\t      ' + 'Show help.' + '\t\t\t\t\t\t' + '[boolean]\n',
  );
}
function printResponse(response){
if(response!=null) {
  if (response.deliveryStatus == 'DELIVERED')
    console.log("Your package was delivered the " + response.timestamp)
  else if (response.deliveryStatus == 'FLY' && response.position != undefined) {
    console.log("Your package is being delivered")
    console.log("Position : '" + response.position.latitude + "," + response.position.longitude + ")")
  } else console.log("Your package is not yet shipped")
}
else
  console.log("Your package is not yet delivered or OrderId doesn't exist")
}

function respond() {
  let args = yargs.argv._;
  const XMLHttpRequest = require('xhr2');
  const Http = new XMLHttpRequest();

  const url2 = 'http://localhost:3002/delivery-status?orderId='+args[0];
  //const url2 = 'http://localhost:3002/delivery-status/status';
//  url2.searchParams.set('orderId', args[0]);
  Http.open('GET', url2);
  Http.responseType = 'json';
  Http.send();
  //console.log(args[0])
 // console.log(url2)


  Http.onload = function() {
    if (Http.status != 200) { // analyze HTTP status of the response
      console.log(`Error ${Http.status}: ${Http.statusText}`); // e.g. 404: Not Found
    } else { // show the result
      let responseObj = Http.response;
      printResponse(responseObj)
   //   console.log(responseObj); // Hello, world!

    }


  };



  Http.onerror = function() {
    console.log("Request failed");
  };

}
