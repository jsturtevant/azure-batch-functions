var batch = require('azure-batch');
var helpers = require('../helpers/helpers.js');

module.exports = function (context, req) {
    context.log('processing...');
    
    var batch_client = helpers.batchClientFactory();

    var poolid = "pool" + req.body.poolid;
    var jobid = "job" + req.body.jobid;
    
    batch_client.pool.exists(poolid).then(exists => {
        if (!exists){
            context.res = {
                status: 404,
                body: "poolid does not exist"
            };

            context.done();
        }

        var pool_config = {poolId:poolid};
        
        //pre-load image for fast task runs times
        var job_prep_task_config = {
            id: "installprereq", 
            commandLine: "docker pull jsturtevant/pyprocessor", 
            userIdentity: {
                autoUser: {
                    elevationLevel: 'admin'
                }
            },
            waitForSuccess: true
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