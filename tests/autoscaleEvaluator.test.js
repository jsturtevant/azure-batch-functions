const test = require('tape-catch'),
        td = require('testdouble');

const AutoScaleEvaluator = require('../functions/EvaluateAutoScale/autoScaleEvaluator');

test('AutoScale Evaluator Tests', function (group) {
    var evaluator = new AutoScaleEvaluator({});

    group.test('if pool is not active reject', function (t) {
        t.plan(1);

        evaluator.isAutoScaleEnabled({
            state: "notactive"
        }).then(_ => {
            t.fail("it was not rejected");
        }).catch(err => {
            t.pass("should reject");
        });
    });

    group.test('if pool is active resolve with pool info', function (t) {
        t.plan(1);

        evaluator.isAutoScaleEnabled({
            state: "active"
        }).then(poolInfo => {
            t.same(poolInfo, {
            state: "active"
        })
        }).catch(err => {
            t.fail("should not reject");
        });
    });

   
    group.end();
});