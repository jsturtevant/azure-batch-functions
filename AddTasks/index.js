var batch = require('azure-batch');
var helpers = require('../helpers/helpers.js');

module.exports = function (context, req) {
    context.log('processing...');
    
    var batch_client = helpers.batchClientFactory();

    // Create a unique Azure Batch pool ID
    var jobid = "job" + req.body.jobid;
    
    context.log(`Adding tasks to ${jobid}...`);   

    var tasksToAdd = ["task1","task2","task3","task4"]
    
    var promises = [];
    tasksToAdd.forEach(function(val,index){           
        var taskName = val;
               
        var taskConfig = {
            id: taskName,
            displayName: 'process audio in ' + taskName,
            commandLine: 'docker run jsturtevant/pyprocessor ' + taskName,
            userIdentity: {
                autoUser: {
                    elevationLevel: 'admin'
                }
            },
        };

        promises.push(batch_client.task.add(jobid, taskConfig).then(_ => {
            context.log(`task added ${taskName}`)
        }).catch(err => {
            context.log(`An error occurred processing ${taskName}.`);
            context.log(err);
        }));
    }); 

    Promise.all(promises.map(helpers.reflect)).then(function(results){
        context.log("completed all promises");

        var success = results.filter(x => x.status === "resolved");
        var rejected = results.filter(x => x.status === "rejected");

        success.forEach(function(val,index){    
            context.log(val);
        });

        rejected.forEach(function(val,index){    
            context.log(val);
        });

        context.done();
    });
};

