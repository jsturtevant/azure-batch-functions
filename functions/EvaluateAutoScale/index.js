var batch = require('azure-batch');
var helpers = require('../helpers/helpers.js');
var os = require("os");
var moment = require('moment');
var validator = require('validator');

module.exports = function (context, req) {
    context.log('processing...');
    
    var batch_client = helpers.batchClientFactory();
    
    if (!req.body.poolid || validator.isEmpty(req.body.poolid)){
        context.log("Invalid response");
        context.res = { status: 400, body: 'must pass poolid' }; 
        context.done();
        return;
    }

    var poolId = req.body.poolid;
    var maxNodes = req.body.maxNodes;

    batch_client.pool.get(poolId).then((poolInfo) => {
        context.log(`pool state: ${poolInfo.state}`);
        return isAutoScaleEnabled(poolInfo);
    }).then(poolInfo => {
        context.log(`Auto Scale: ${poolInfo.enableAutoScale}`);
        return ensureAutoScaleSet(batch_client, poolInfo);
    }).then(_ => {
        return evaluateAutoScale(batch_client, poolId, maxNodes);
    }).then(evalResult => {
        context.log("Auto Scale Results:");
        context.log(evalResult.results.replace("\$/gi", os.EOL + "\t$"));
        context.done();
    }).catch(err => {
        context.log('An error occurred.');
        printErrors(context, err);
        context.done();
    });

};

function isAutoScaleEnabled(poolInfo){
    if(poolInfo.state != "active")
    {
        return Promise.reject({code: "notActive"});
    }

    return Promise.resolve(poolInfo);
}

function ensureAutoScaleSet(batch_client, poolInfo){
    if (poolInfo.enableAutoScale == true)
    {
        return Promise.resolve();
    }

    var autoScaleProperties ={
        autoScaleFormula: `$TargetLowPriorityNodes = ${poolInfo.currentLowPriorityNodes};`,
        autoScaleEvaluationInterval: moment.duration(5, 'minutes')
    };

    //enable if first and set to current.
    return batch_client.pool.enableAutoScale(poolInfo.id, autoScaleProperties)
}

function evaluateAutoScale(batch_client, poolId, maxNodes){
       var myFormula = `maxNodes 		 =  ${maxNodes};

// Get pending tasks for the past 15 minutes.
// If we have fewer than 70 percent data points, we use the last sample point,
// otherwise we use the maximum of last sample point and the history average.
$samples = $ActiveTasks.GetSamplePercent(TimeInterval_Minute * 15);
$tasks = $samples < 70 ? max(0,$ActiveTasks.GetSample(1)) : max( $ActiveTasks.GetSample(1), avg($ActiveTasks.GetSample(TimeInterval_Minute * 15)));

// If number of pending tasks is not 0, set targetVM to pending tasks, otherwise
// half of current LowPriority.
// The pool size is capped at maxNodes (4), if target VM value is more than that, set it
// to maxNodes. This value should be adjusted according to your use case.
$targetVMs = $tasks > 0? $tasks:max(0, $TargetLowPriorityNodes/2);

$TargetLowPriorityNodes = max(0, min($targetVMs, maxNodes));`;

        return batch_client.pool.evaluateAutoScale(poolId, myFormula);
}

function printErrors(context, err){
    if (err.body)
    {
        context.log(err.body.code);
        context.log(err.body.message);
        context.log(err.body.values);
    } else if (err.code && err.code === "notActive")
    {
        context.log("pool is not active");
    } else {
        context.log(err);
    }
}