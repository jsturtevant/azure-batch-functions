var batch = require('azure-batch');

module.exports = function (context, req) {
     context.log('processing...');
    
    var accountName = process.env.batchAccountName;
    var accountKey = process.env.batchAccountKey;
    var accountUrl = process.env.batchAccountUrl;

    var credentials = new batch.SharedKeyCredentials(accountName,accountKey);
    var batch_client = new batch.ServiceClient(credentials,accountUrl);

    let options = {}
    options.jobListOptions = { maxResults : 10 };

    batch_client.job.list(options).then((result) => {
        context.log(result);

        loop(result.odatanextLink, batch_client.job.listNext).then(() => {
           context.log('complete');
           context.done();  
        });

    }).catch((err) => {
        context.log('An error occurred.');
        context.log(err);
        context.done();
    });
};

function loop(nextLink, callNext) {
    if (nextLink !== null && nextLink !== undefined) {
        return callNext(nextLink).then((res) => {
            context.log(res);
            return loop(res.odatanextLink, callNext);
        });
    }

    return Promise.resolve();
};