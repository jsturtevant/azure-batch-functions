var test = require('tape-catch');
var td = require('testdouble');

var funcHarness = require('azure-functions-node-harness');
var reqBuilder = require('azure-functions-node-harness/src/request-builder');
var helpers = td.replace('../functions/helpers/helpers.js');

test('Evaluate AutoScale Tests', function (group) {
    var funcToTest = funcHarness('EvaluateAutoScale', { dirname: 'functions' });

    group.test('if poolid is empty then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "poolid": "",
                "maxNodes": 4
            }
        }).then(context => {
            t.equal(400, context.res.status);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.test('if poolid is null then return status 400', function (t) {
        t.plan(1);

        funcToTest.invokeHttpTrigger({
            reqBody: {
                "maxNodes": 4
            }
        }).then(context => {
            t.equal(400, context.res.status);
        }).catch(err => {
            t.fail(`something went wrong: ${err}`);
        });
    });

    group.end();
});