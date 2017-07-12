const test = require('tape-catch'),
        td = require('testdouble'),
        funcHarness = require('azure-functions-node-harness');

// overrides
const helpers = td.replace('../functions/helpers/helpers');
const AutoScaleEvaluator = td.replace('../functions/EvaluateAutoScale/autoScaleEvaluator');

test('Evaluate AutoScale Tests', function (group) {
    const funcToTest = funcHarness('EvaluateAutoScale', { dirname: 'functions' });

    td.when(helpers.batchClientFactory()).thenReturn({pool: {}});


    group.test('if poolid is empty then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "",
                "maxNodes": 4
            }
        }).then(context => {
            t.equal(context.res.status, 400);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if poolid is null then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": null,
                "maxNodes": 4
            }
        }).then(context => {
            t.equal(context.res.status, 400);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if poolid is missing then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "maxNodes": 4
            }
        }).then(context => {
            t.equal(context.res.status, 400);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if maxnodes is empty then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool",
                "maxNodes": ""
            }
        }).then(context => {
            t.equal(context.res.status, 400);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if maxnodes is null then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool",
                "maxNodes": null
            }
        }).then(context => {
            t.equal(context.res.status, 400);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if maxnodes is missing then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool"
            }
        }).then(context => {
            t.equal(context.res.status, 400);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if maxnodes not a number return 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool",
                "maxNodes": "some"
            }
        }).then(context => {
            t.equal(context.res.status, 400);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if valid parameters should return 200', function (t) {
        t.plan(1);

        td.when(AutoScaleEvaluator.prototype.evaluateAutoScale("testpool", "1")).thenResolve({results:""})

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool",
                "maxNodes": "1"
            }
        }).then(context => {
            t.equal(context.res.status, 200);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if valid max node is number should return 200', function (t) {
        t.plan(1);

        td.when(AutoScaleEvaluator.prototype.evaluateAutoScale("testpool", 1)).thenResolve({results:""})

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool",
                "maxNodes": 1
            }
        }).then(context => {
            t.equal(context.res.status, 200);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

     group.test('on success should parse results to return object', function (t) {
        t.plan(4);

        td.when(AutoScaleEvaluator.prototype.evaluateAutoScale("testpool", "1"))
            .thenResolve({results:"$TargetDedicatedNodes=10;$TargetLowPriorityNodes=5;$NodeDeallocationOption=requeue;$workHours=0"})

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool",
                "maxNodes": "1"
            }
        }).then(context => {
            t.equal(context.res.status, 200);
            t.equal(context.res.body.TargetDedicatedNodes, 10);
            t.equal(context.res.body.TargetLowPriorityNodes, 5);
            t.equal(context.res.body.Raw, "$TargetDedicatedNodes=10;$TargetLowPriorityNodes=5;$NodeDeallocationOption=requeue;$workHours=0")
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if valid parameters but evaluator throws exception then 500', function (t) {
        t.plan(1);

        td.when(AutoScaleEvaluator.prototype.evaluateAutoScale("testpool", "1")).thenReject({err:"something blew up"})

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "testpool",
                "maxNodes": "1"
            }
        }).then(context => {
            t.equal(context.res.status, 500);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.end();
});