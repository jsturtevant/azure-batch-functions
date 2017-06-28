var test = require('tape-catch');
var td = require('testdouble');

var funcFake = require('./azure-functions-node-harness');
var fakeRequest = require('./func-fake/func-fake.js');
var helpers = td.replace('../functions/helpers/helpers.js');

var evalAutoScale = require('../functions/EvaluateAutoScale/index.js')

test('Evaluate AutoScale Tests', function (group) {
    group.test('if poolid is empty then return status 400', function (t) {
        t.plan(1);

        var funcToTest = funcFake('EvaluateAutoScale', { dirname: 'functions' });

        var request = fakeRequest.httpRequest({
            "poolid": "",
            "maxNodes": 4
        });

        funcToTest.invoke({
            req: request
        }).then(context => {
            t.equal(400, context.res.status);
        }).catch(err =>{
            t.fail(`something went wrong: ${err}`);
        });
    });

    // group.test('if poolid is null then return status 400', function (t) {
    //     t.plan(1);

    //     var request = funcFake.httpRequest({
    //         "maxNodes": 4
    //     });

    //     var context = funcFake.httpContext(request);

    //     context.done = function () {
    //         t.equal(400, context.res.status)
    //     }

    //     evalAutoScale(context, request);
    // });

    group.end();
});