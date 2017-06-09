var batch = require('azure-batch');

module.exports = function (context, req) {
    context.log('processing...');
    
    var accountName = 'workshopbatch';
    var accountKey = 'MuO+jVAcbgMf4HVrbHgwwZCGLK0/DWgt+TYVUtGYcwHRayNjVg/2kmczu3l3c813FKsRfy/A66ofqSnv1Jk4wA==';
    var accountUrl = 'https://workshopbatch.eastus.batch.azure.com'

    var credentials = new batch.SharedKeyCredentials(accountName,accountKey);
    var batch_client = new batch.ServiceClient(credentials,accountUrl);

    // Creating Image reference configuration for Ubuntu Linux VM
    var imgRef = {publisher:"Canonical",offer:"UbuntuServer",sku:"16.04.0-LTS",version:"latest"}
    var vmconfig = {imageReference:imgRef,nodeAgentSKUId:"batch.node.ubuntu 16.04"}
    var vmSize = "STANDARD_A1"
    var numVMs = 4

    // Create a unique Azure Batch pool ID
    var poolid = "pool" + req.params.poolid;
    
    context.log(`Creating new pool ${poolid}...`);    

    let options = {}
    options.accountListNodeAgentSkusOptions = { maxResults : 5 };

    batch_client.account.listNodeAgentSkus(options).then((res) => {
        context.log(res);

        loop(res.odatanextLink, batch_client, context).then(() => {
            context.log('done.');
            context.done();
        });
    }).catch((err) => {
        context.log('An error occurred.');
        context.log(err);
        context.done();
    });
};

function loop(nextLink, batch_client, context) {
    if (nextLink !== null && nextLink !== undefined) {
        return batch_client.account.listNodeAgentSkusNext(nextLink).then((res) => {
            context.log(res);
            return loop(res.odatanextLink, batch_client);
        });
    }

    return Promise.resolve();
};