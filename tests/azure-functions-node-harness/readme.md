# Azure Functions Node Harness

> :construction: This library is still in alpha and not supported by the Azure Functions team for any use. :construction:

Easily invoke your Functions from test harnesses, etc.

npm i --save christopheranderson/<TODO>

## Usage

```javascript
var func = require('azure-functions-node-harness');

var queueFunc = func('queue'); // Optional config: , {dirname: __dirname}); 
var invocation = queueFunc.invoke({trigger: {'hello':'world'}});

invocation.then(function(data) {
    console.log('done');
    console.log(JSON.stringify(data, null, ' ' ));
})
```

### `FunctionsHarness(nameOrPath: string, [config: Object])`

```javascript
var func = require('azure-functions-node-harness');

var queueFunc = func('queue'); // Optional config: , {dirname: __dirname}); 
var httpFunc = new func('queue'); //same thing - supports new and factory idioms
```

 - nameOrPath: string
    - Selects the name or path you want to load. Uses node module loading logic (i.e. `queue` will look for `./queue/index.js`, )
 - config: Object
    - Helps adjust settings. Mostly advanced features.
    - Properties:
        - dirname: string
            - Which directory to look in for functions. Useful when tests are in a different directory than sample functions.

### `#.invoke(data: Object, [cb: function])`

```javascript
var func = require('azure-functions-node-harness');

var queueFunc = func('queue');

// Supports callbacks
queueFunc.invoke({trigger: {'hello':'world'}}, function(err, results) {
    // add results handling logic here
};

// Returns a promise if no callback is given
var invocation = queueFunc.invoke({trigger: {'hello':'world'}});
invocation.then(function(results){
    // success logic here
}).catch(function(err){
    // failure logic here
})

```

 - data
    - Key-value list of inputs. Use the name of your bindings for the keys
 - cb
    - Optionally give a callback for your Function. If you don't, the funciton will return a Promise.

## Using with test frameworks (coming soon...)

TBD, but basically, you can use something like mocha, set up the function in before then call invoke in each test. If you use chai and chai-as-promised, you should be able to have some nifty assertions.

 - [mocha](https://mochajs.org/)
 - [chai](http://chaijs.com/)
 - [chai-as-promised](https://github.com/domenic/chai-as-promised)

## License

[MIT](LICENSE)