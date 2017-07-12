const moment = require('moment');

module.exports = class AutoScaleEvaluator {
    constructor(pool){
        this.pool = pool;
    }

    evaluateAutoScale(poolId, maxNodes){
        return this.pool.get(poolId).then((poolInfo) => {
            return isAutoScaleEnabled(poolInfo);
        }).then(poolInfo => {
            return ensureAutoScaleSet(batch_client, poolInfo);
        }).then(_ => {
            return executeEvaluateAutoScale(batch_client, poolId, maxNodes);
        });
    }

    isAutoScaleEnabled(poolInfo){
        if(poolInfo.state != "active")
        {
            return Promise.reject({code: "notActive"});
        }

        return Promise.resolve(poolInfo);
    }

    ensureAutoScaleSet(poolInfo){
        if (poolInfo.enableAutoScale == true)
        {
            return Promise.resolve();
        }

        var autoScaleProperties ={
            autoScaleFormula: `$TargetLowPriorityNodes = ${poolInfo.currentLowPriorityNodes};`,
            autoScaleEvaluationInterval: moment.duration(5, 'minutes')
        };

        //enable if first and set to current.
        return this.pool.enableAutoScale(poolInfo.poolId, autoScaleProperties)
    }

    executeEvaluateAutoScale(poolId, maxNodes){
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

        return this.pool.evaluateAutoScale(poolId, myFormula);
    }

}