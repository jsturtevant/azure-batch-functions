var batch = require('azure-batch');

module.exports = function (context, req) {
    context.log('processing...');
    
    var accountName = process.env.batchAccountName;
    var accountKey = process.env.batchAccountKey;
    var accountUrl = process.env.batchAccountUrl;
    
    var credentials = new batch.SharedKeyCredentials(accountName,accountKey);
    var batch_client = new batch.ServiceClient(credentials,accountUrl);

    var poolid = "pool" + req.params.poolid;
    
    batch_client.pool.exists(poolid).then(exists => {
        if (!exists){
            context.res = {
                status: 404,
                body: "poolid does not exist"
            };

            context.done();
        }

        var pool_config = {poolId:poolid};
        var jobId = "processaudiojob";
        
        // todo create a sas token
        var job_prep_task_config = {
            id: "installprereq", 
            commandLine: "sudo sh docker_starttask.sh > startup.log", 
            resourceFiles: [{ 
                'blobSource': process.env.blobsasurl, 
                'filePath': 'docker_starttask.sh' 
            }], 
            waitForSuccess: true, 
            runElevated: true
        };

        var job_config = {
            id:jobId,
            displayName:"process audio files",
            jobPreparationTask:job_prep_task_config,
            poolInfo:pool_config
        }

        var job = batch_client.job.add(job_config).then(_ => {
            context.log('Added Job');
            context.done();
        }).catch((err) => {
            context.log('An error occurred.');
            context.log(err);
            context.done(); 
        });
    });
};