const test = require('tape-catch'),
    td = require('testdouble'),
    moment = require('moment');

const AutoScaleEvaluator = require('../functions/EvaluateAutoScale/autoScaleEvaluator');

test('Auto Scale evaluator', function (group) {
    var poolFake = td.object(['enableAutoScale', 'evaluateAutoScale']);
    td.when(poolFake.enableAutoScale(td.matchers.anything(), td.matchers.anything())).thenResolve({});

    var evaluator = new AutoScaleEvaluator(poolFake);

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

    group.test('if pool info is null reject', function (t) {
        t.plan(1);

        evaluator.isAutoScaleEnabled({
            state: null
        }).then(_ => {
            t.fail("it was not rejected");
        }).catch(err => {
            t.pass("should reject");
        });
    });

    group.test('if pool info is empty reject', function (t) {
        t.plan(1);

        evaluator.isAutoScaleEnabled({
            state: null
        }).then(_ => {
            t.fail("it was not rejected");
        }).catch(err => {
            t.pass("should reject");
        });
    });

    group.test('if pool info is "active" resolve with pool info', function (t) {
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

    group.test('if auto scale is already enabled all ready true then resolve', function (t) {
        t.plan(1);

        evaluator.ensureAutoScaleSet({
            enableAutoScale: true
        }).then(_ => {
            t.pass("should resolve")
        }).catch(err => {
            t.fail("should not reject");
        });
    });

    group.test('set auto scale should return promise', function (t) {
        t.plan(1);

        evaluator.ensureAutoScaleSet({
            poolId: "testpool",
            currentLowPriorityNodes: 2
        }).then(_ => {
            td.verify(poolFake.enableAutoScale("testpool", td.matchers.anything()));
            t.pass("should resolve");
        }).catch(err => {
            console.log(td.explain(poolFake.enableAutoScale));
            t.fail("should not reject");
        });
    });

    group.test('executeEvaluateAutoScale auto scale should call evaluate with correct max nodes', function (t) {
        t.plan(1);

        evaluator.executeEvaluateAutoScale("testpool", 5);

        td.verify(poolFake.evaluateAutoScale("testpool", td.matchers.contains('maxNodes 		 =  5;')));
        t.pass();
    });

    group.end();
});