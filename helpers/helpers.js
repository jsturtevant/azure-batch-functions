var batch = require('azure-batch');

module.exports = {
    batchClientFactory: function(){
        var accountName = process.env.batchAccountName;
        var accountKey = process.env.batchAccountKey;
        var accountUrl = process.env.batchAccountUrl;
        
        var credentials = new batch.SharedKeyCredentials(accountName,accountKey);
        return new batch.ServiceClient(credentials,accountUrl);
    }
}