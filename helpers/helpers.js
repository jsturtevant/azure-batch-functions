var batch = require('azure-batch');
var azure = require('azure-storage');

module.exports = {
    batchClientFactory: function () {
        var accountName = process.env.batchAccountName;
        var accountKey = process.env.batchAccountKey;
        var accountUrl = process.env.batchAccountUrl;

        var credentials = new batch.SharedKeyCredentials(accountName, accountKey);
        return new batch.ServiceClient(credentials, accountUrl);
    },

    /**
     * Wait for all promises. https://stackoverflow.com/a/31424853
     * 
     * Promise.all(promises.map(helpers.reflect)).then(function(results){
     *      var success = results.filter(x => x.status === "resolved");
     * });
     * 
     * @param  {Promise} promise
     * @return {Array}
     */
    reflect: function (promise) {
        return promise.then(function (v) { return { v: v, status: "resolved" } },
                function (e) { return { e: e, status: "rejected" } });
    },

    /**
     * An HTTP trigger Azure Function that returns a SAS token for Azure Storage for the specified container. 
     * You can also optionally specify a particular blob name and access permissions. 
     * 
     * Modified from:
     * The MIT License (MIT) Copyright (c) 2015 Microsoft Corporation
     * To learn more, see https://github.com/Azure-Samples/functions-dotnet-sas-token/blob/master/README.md
     */
    generateSasToken: function generateSasToken(container, blobName, permissions) {
        var connString = process.env.AzureWebJobsStorage;
        var blobService = azure.createBlobService(connString);

        // Create a SAS token that expires in an hour
        // Set start time to five minutes ago to avoid clock skew.
        var startDate = new Date();
        startDate.setMinutes(startDate.getMinutes() - 5);
        var expiryDate = new Date(startDate);
        expiryDate.setHours(startDate.getHours() + 12);

        permissions = permissions || azure.BlobUtilities.SharedAccessPermissions.READ;

        var sharedAccessPolicy = {
            AccessPolicy: {
                Permissions: permissions,
                Start: startDate,
                Expiry: expiryDate
            }
        };
        
        var sasToken = blobService.generateSharedAccessSignature(container, blobName, sharedAccessPolicy);
        
        return {
            token: sasToken,
            uri: blobService.getUrl(container, blobName, sasToken, true)
        };
    }
}