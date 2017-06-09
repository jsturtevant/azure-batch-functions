var batch = require('azure-batch');

module.exports = function (context, req) {
    context.log('processing...');
    
    var accountName = process.env.batchAccountName;
    var accountKey = process.env.batchAccountKey;
    var accountUrl = process.env.batchAccountUrl;

    var credentials = new batch.SharedKeyCredentials(accountName,accountKey);
    var batch_client = new batch.ServiceClient(credentials,accountUrl); 
    
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