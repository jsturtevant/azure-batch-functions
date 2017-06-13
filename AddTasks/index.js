var batch = require('azure-batch');
var helpers = require('../helpers/helpers.js');
var crypto = require('crypto');

module.exports = function (context, req) {
    context.log('processing...');
    
    var batch_client = helpers.batchClientFactory();

    // Create a unique Azure Batch pool ID
    var jobid = "job" + req.body.jobid;
    var forcePull = req.body.forcePull;
    var imageName = req.body.imageName;
    var makeTasksRandom = req.body.makeTasksRandom;
    

    var tasksToAdd = ["158420"]
    
    var tasks = [];
    tasksToAdd.forEach(function(val,index){
        var taskName = `track_${val}`;
        if (makeTasksRandom){
            // https://stackoverflow.com/a/14869745
            var id = crypto.randomBytes(10).toString('hex');
            taskName = taskName.concat("_",id);
        }
        
        var commands = [`docker run ${imageName} ${val}`];
        if (forcePull){
            // don't know which node this will be run on so force on all tasks.
            commands.unshift(`docker pull ${imageName}`)
        }

        var taskConfig = {
            id: taskName,
            displayName: taskName,
            commandLine: helpers.wrapInShell(commands),
            userIdentity: {
                autoUser: {
                    elevationLevel: 'admin'
                }
            },
        };

        context.log(`adding task ${taskName} to list`);
        tasks.push(taskConfig);
    });

    batch_client.task.addCollection(jobid, tasks).then((tc) => {
        context.log(`added collection of tasks`);
        context.log(tc);
        //todo handle each task completion indepently.
        
        context.done();
    }).catch(err => {
        context.log(`An error occurred processing...`);
        context.log(err);
        context.done();
    });
};

