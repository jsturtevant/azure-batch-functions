var batch = require('azure-batch');
var helpers = require('../helpers/helpers.js');

module.exports = function (context, req) {
    context.log('processing...');
    
    var batch_client = helpers.batchClientFactory();

    // Create a unique Azure Batch pool ID
    var poolid = "pool" + req.body.poolid;
    
    context.log(`Creating new pool ${poolid}...`);    
    batch_client.account.listNodeAgentSkus().then((agentNodes) => {
        context.log(agentNodes);

        var agentNode = agentNodes.filter(x => x.id === 'batch.node.ubuntu 16.04')[0];
        var verifiedImage = agentNode.verifiedImageReferences[0];
        
        var vmconfig = {imageReference:verifiedImage,
                        nodeAgentSKUId:"batch.node.ubuntu 16.04"};
        var vmSize = "STANDARD_A1";
        var numVMs = 2;

        var sastoken = helpers.generateSasToken("azurebatch", "docker_install_start_task.sh")

        var poolConfig = {
            id: poolid,
            displayName: poolid,
            vmSize: vmSize,
            virtualMachineConfiguration: vmconfig,
            targetDedicated: numVMs,
            targetLowPriorityNodes: numVMs,
            startTask: {
                commandLine: "./docker_install_start_task.sh > startup.log",
                resourceFiles: [{
                    blobSource: sastoken.uri,
                    filePath: 'docker_install_start_task.sh'
                }],
                userIdentity: {
                    autoUser: {
                        elevationLevel: 'admin'
                    }
                },
                waitForSuccess: true
            },
            enableAutoScale: false
        };

        batch_client.pool.exists(poolid).then(exists => {
            if (exists){
                context.log("already exists");
                context.done();
            }

            batch_client.pool.add(poolConfig).then(() =>{
                context.log('pool added.')
                context.done();    
            });
        });
    }).catch((err) => {
        context.log('An error occurred.');
        context.log(err);
        context.done();
    });
};