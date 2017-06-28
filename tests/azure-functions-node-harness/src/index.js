var util = require('util'),
    path = require('path')

var FunctionHarness = function(nameOrPath, config) {
    that = this;
    this.config = config || {};
    this.f = loadFunction(nameOrPath, this.config.dirname);
    this.invoke = function(data, cb) {
        invoke = this;
        var inputs = (function(data) {
            var out = [];
            for(var name in data) {
                out.push(data[name]);
            }
            return out;
        })(data);

        if(cb) {
            this.context = {
                bindings: data,
                done: function(results) {
                    var output = [];
                    
                    for (var name in results) {
                        invoke.bindings[name] = results[name];
                    }

                    cb(invoke.context.bindings);
                },
                log: function(log) {
                    console.log(log);
                }
            }

            inputs.unshift(this.context);

            that.f.function.apply(null, inputs);
        } else {
            return new Promise(function(resolve, reject) {
                invoke.context = {
                    bindings: data,
                    done: function(err, results) {
                        if(err) {
                            reject(err);
                        } else {
                            var output = [];
                    
                            for (var name in results) {
                                invoke.bindings[name] = results[name];
                            }

                            resolve(invoke.context);
                        }
                    },
                    log: function(log) {
                        console.log(log);
                    }
                }

                inputs.unshift(invoke.context);

                that.f.function.apply(null, inputs);
            });
        }
    }
    return {
        invoke: that.invoke
    }
}

var loadFunction = function(nameOrPath, dirname) {   
    var directory = dirname || process.cwd();

    //Otherwise, if we were given a path or name, attempt to load it
    var functionPath = path.resolve(path.join(directory, nameOrPath))
    var pathToModule = require.resolve(functionPath);
    var config = require(path.join(path.dirname(pathToModule), 'function.json'));
    var m = require(pathToModule);

    if(typeof m === 'function') {
        return { 
            function: m,
            config: config
        };
    } else if (config.entryPoint && m[config.entryPoint]) {
        return {
            function: m[config.entryPoint],
            config: config
        };
    } else if (Object.keys(m).length === 1) {
        return {
            function: m[Object.keys(m)[0]],
            config: config
        };
    } else if (typeof m['run'] === 'function') {
        return {
            function: m['run'],
            config: config
        };
    } else {
        throw 'Could not find a function based on the Azure Functions resolution rules'
    }
}

module.exports = FunctionHarness