var batch = require('azure-batch');

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
    }
}