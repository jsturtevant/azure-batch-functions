var batch = require('azure-batch');
var helpers = require('../helpers/helpers.js');

module.exports = function (context, req) {
    context.log('processing...');
    
    var batch_client = helpers.batchClientFactory();
    
    var poolid = "pool" + req.body.poolid;

    context.log(`getting info for ${poolid}`);
    batch_client.pool.get(poolid).then((poolinfo) => {
        context.log(`pool state: ${poolinfo.state}`);
        if(poolinfo.state == "active")
        {
            console.log("Pool is active");
        }

        context.done();
    }).catch(err => {
        context.log('An error occurred.');
        context.log(err);
        context.done();
    });

};