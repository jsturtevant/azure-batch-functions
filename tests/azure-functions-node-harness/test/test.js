var func = require('../src/index.js');

var queueFunc = func('queue', {dirname: __dirname}); 
var invocation = queueFunc.invoke({trigger: {'hello':'world'}});

invocation.then(function(data) {
    console.log('done');
    console.log(JSON.stringify(data, null, ' ' ));
})