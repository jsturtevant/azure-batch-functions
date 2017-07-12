const batch = require('azure-batch'),
    helpers = require('../helpers/helpers'),
    validator = require('validator'),
    os = require("os"),
    AutoScaleEvaluator = require('./autoScaleEvaluator');

module.exports = function (context, req) {
    context.log('processing...');

    const batch_client = helpers.batchClientFactory();

    if (!req.body.poolid || validator.isEmpty(req.body.poolid)) {
        context.log("Invalid response");
        context.res = { status: 400, body: 'must pass poolid' };
        context.done();
        return;
    }

    if (!req.body.maxNodes || validator.isEmpty(req.body.maxNodes.toString()) || !validator.isNumeric(req.body.maxNodes.toString())) {
        context.log("Invalid response");
        context.res = { status: 400, body: 'must pass maxNodes' };
        context.done();
        return;
    }

    const poolId = req.body.poolid;
    const maxNodes = req.body.maxNodes;

    let evaluator = new AutoScaleEvaluator(batch_client.pool);

    evaluator.evaluateAutoScale(poolId, maxNodes).then(evalResult => {
        context.log("Auto Scale Results:");
        context.log(evalResult.results.replace("\\$/gi", os.EOL + "\t$"));

       const extractedResults = extractResults(evalResult.results);

        context.res = {
            status: 200,
            body: {
                TargetDedicatedNodes: extractedResults.dedicatedNodes,
                TargetLowPriorityNodes: extractedResults.lowPriorityNodes,
                Raw: evalResult.results
            }
        };

        context.done();
    }).catch(err => {
        context.log('An error occurred.');
        printErrors(context, err);
        context.res = { status: 500 };
        context.done();
    });
};

function extractResults(results){
     const dedicatedNodes = results.match("\\$TargetDedicatedNodes=([0-9]{0,});");
     const lowPriorityNodes = results.match("\\$TargetLowPriorityNodes=([0-9]{0,});");

     return {
         dedicatedNodes: (dedicatedNodes && dedicatedNodes.length > 1) ?  parseInt(dedicatedNodes[1]) : 0,
         lowPriorityNodes: (lowPriorityNodes && lowPriorityNodes.length) > 1 ? parseInt(lowPriorityNodes[1]) :0
     }
}


function printErrors(context, err) {
    if (err.body) {
        context.log(err.body.code);
        context.log(err.body.message);
        context.log(err.body.values);
    } else if (err.code && err.code === "notActive") {
        context.log("pool is not active");
    } else {
        context.log(err);
    }
}