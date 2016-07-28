var awsIot = require('aws-iot-device-sdk');

var myThingName = 'galileo';

var thingShadows = awsIot.thingShadow({
   keyPath: './cert/805dfbd8a4-private.pem.key',   // path of private key - change the name accourding to your key name
  certPath: './cert/805dfbd8a4-certificate.pem.crt', // path of certificate - change the name accourding to your cert name
    caPath: './cert/rootCA.pem',  // path of root file
  clientId: myThingName,
    region: 'us-east-1'  // your region
});

mythingstate = {
  "state": {
    "reported": {
      "LocalIP": "unknown"
    }
  }
}

var networkInterfaces = require( 'os' ).networkInterfaces( );
console.log(networkInterfaces);
mythingstate["state"]["reported"]["LocalIP"] = networkInterfaces['wlp1s0'][0]['address'];
//mythingstate["state"]["reported"]["LocalIP"] = networkInterfaces['enp0s20f6'][1]['address'];


// json data for dynamoDB
var msg = "{\"key\":\"value\"}";

thingShadows.on('connect', function() {
  console.log("Connected...");
  console.log("Registering...");
  thingShadows.register( myThingName );

  // An update right away causes a timeout error, so we wait about 2 seconds
  setTimeout( function() {
    console.log("Updating my IP address...");
    clientTokenIP = thingShadows.update(myThingName, mythingstate);
    console.log("Update:" + clientTokenIP);
  }, 2500 );


  // Code below just logs messages for info/debugging
  thingShadows.on('status',
    function(thingName, stat, clientToken, stateObject) {
       console.log('received '+stat+' on '+thingName+': '+
                   JSON.stringify(stateObject));
    });

  thingShadows.on('update',
      function(thingName, stateObject) {
         console.log('received update '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('delta',
      function(thingName, stateObject) {
         console.log('received delta '+' on '+thingName+': '+
                     JSON.stringify(stateObject));
      });

  thingShadows.on('timeout',
      function(thingName, clientToken) {
         console.log('received timeout for '+ clientToken)
      });

  thingShadows
    .on('close', function() {
      console.log('close');
    });
  thingShadows
    .on('reconnect', function() {
      console.log('reconnect');
    });
  thingShadows
    .on('offline', function() {
      console.log('offline');
    });
  thingShadows
    .on('error', function(error) {
      console.log('error', error);
    });


});
